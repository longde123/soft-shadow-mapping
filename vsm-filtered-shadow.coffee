## add the canvas to the dom ##
name = 'vsm-filtered-shadow'
document.write "<div id=\"#{name}\" class=\"example\"></div>"
container = $('#' + name)
canvas = $('<canvas></canvas>').appendTo(container)[0]

## setup the framework ##
try
    gl = new WebGLFramework(canvas)
        .depthTest()
    gl.getExt('OES_texture_float')
    gl.getExt('OES_standard_derivatives')
    gl.assertFloatRenderTarget()
catch error
    container.empty()
    $('<div class="error"></div>').text(error).appendTo(container)
    $('<div class="error-info"></div>').text('(screenshot instead)').appendTo(container)
    $("<img src=\"#{name}.png\">").appendTo(container)
    return

## fullscreen handling ##
fullscreenImg = $('<img class="toggle-fullscreen" src="fullscreen.png">')
    .appendTo(container)
    .click -> gl.toggleFullscreen(container[0])

gl.onFullscreenChange (isFullscreen) ->
    if isFullscreen
        container.addClass('fullscreen')
        fullscreenImg.attr('src', 'exit-fullscreen.png')
    else
        container.removeClass('fullscreen')
        fullscreenImg.attr('src', 'fullscreen.png')

## handle mouse over ##
hover = false
container.hover (-> hover = true), (-> hover = false)

## animation control ##
animate = true
controls = $('<div class="controls"></div>')
    .appendTo(container)
$('<label>Animate</label>').appendTo(controls)
$('<input type="checkbox" checked="checked"></input>')
    .appendTo(controls)
    .change ->
        animate = @checked

## create webgl objects ##
cubeGeom = gl.drawable meshes.cube
planeGeom = gl.drawable meshes.plane(50)
quad = gl.drawable meshes.quad

displayShader = gl.shader
    common: '''//essl
        varying vec3 vWorldNormal; varying vec4 vWorldPosition;
        uniform mat4 camProj, camView;
        uniform mat4 lightProj, lightView; uniform mat3 lightRot;
        uniform mat4 model;
    '''
    vertex: '''//essl
        attribute vec3 position, normal;

        void main(){
            vWorldNormal = normal;
            vWorldPosition = model * vec4(position, 1.0);
            gl_Position = camProj * camView * vWorldPosition;
        }
    '''
    fragment: '''//essl
        uniform sampler2D sLightDepth;

        float linstep(float low, float high, float v){
            return clamp((v-low)/(high-low), 0.0, 1.0);
        }

        float VSM(sampler2D depths, vec2 uv, float compare){
            vec2 moments = texture2D(depths, uv).xy;
            float p = smoothstep(compare-0.02, compare, moments.x);
            float variance = max(moments.y - moments.x*moments.x, -0.001);
            float d = compare - moments.x;
            float p_max = linstep(0.2, 1.0, variance / (variance + d*d));
            return clamp(max(p, p_max), 0.0, 1.0);
        }

        float attenuation(vec3 dir){
            float dist = length(dir);
            float radiance = 1.0/(1.0+pow(dist/10.0, 2.0));
            return clamp(radiance*10.0, 0.0, 1.0);
        }
        
        float influence(vec3 normal, float coneAngle){
            float minConeAngle = ((360.0-coneAngle-10.0)/360.0)*PI;
            float maxConeAngle = ((360.0-coneAngle)/360.0)*PI;
            return smoothstep(minConeAngle, maxConeAngle, acos(normal.z));
        }

        float lambert(vec3 surfaceNormal, vec3 lightDirNormal){
            return max(0.0, dot(surfaceNormal, lightDirNormal));
        }
        
        vec3 skyLight(vec3 normal){
            return vec3(smoothstep(0.0, PI, PI-acos(normal.y)))*0.4;
        }

        vec3 gamma(vec3 color){
            return pow(color, vec3(2.2));
        }

        void main(){
            vec3 worldNormal = normalize(vWorldNormal);

            vec3 camPos = (camView * vWorldPosition).xyz;
            vec3 lightPos = (lightView * vWorldPosition).xyz;
            vec3 lightPosNormal = normalize(lightPos);
            vec3 lightSurfaceNormal = lightRot * worldNormal;
            vec4 lightDevice = lightProj * vec4(lightPos, 1.0);
            vec2 lightDeviceNormal = lightDevice.xy/lightDevice.w;
            vec2 lightUV = lightDeviceNormal*0.5+0.5;

            // shadow calculation
            float lightDepth2 = clamp(length(lightPos)/40.0, 0.0, 1.0);
            float illuminated = VSM(sLightDepth, lightUV, lightDepth2);
            
            vec3 excident = (
                skyLight(worldNormal) +
                lambert(lightSurfaceNormal, -lightPosNormal) *
                influence(lightPosNormal, 55.0) *
                attenuation(lightPos) *
                illuminated
            );
            gl_FragColor = vec4(gamma(excident), 1.0);
        }
    '''

lightShader = gl.shader
    common: '''//essl
        varying vec3 vWorldNormal; varying vec4 vWorldPosition;
        uniform mat4 lightProj, lightView; uniform mat3 lightRot;
        uniform mat4 model;
    '''
    vertex: '''//essl
        attribute vec3 position, normal;

        void main(){
            vWorldNormal = normal;
            vWorldPosition = model * vec4(position, 1.0);
            gl_Position = lightProj * lightView * vWorldPosition;
        }
    '''
    fragment: '''//essl
        #extension GL_OES_standard_derivatives : enable
        void main(){
            vec3 worldNormal = normalize(vWorldNormal);
            vec3 lightPos = (lightView * vWorldPosition).xyz;
            float depth = clamp(length(lightPos)/40.0, 0.0, 1.0);
            float dx = dFdx(depth);
            float dy = dFdy(depth);
            gl_FragColor = vec4(depth, pow(depth, 2.0) + 0.25*(dx*dx + dy*dy), 0.0, 1.0);
        }
    '''
lightDepthTexture = gl.texture(type:'float', channels:'rgba').bind().setSize(256, 256).linear().clampToEdge()
lightFramebuffer = gl.framebuffer().bind().color(lightDepthTexture).depth().unbind()

## filtering helper ##
class Filter
    constructor: (@size, filter) ->
        @output = gl.texture(type:'float', channels:'rgba')
            .bind().setSize(@size, @size).linear().clampToEdge()
        @framebuffer = gl.framebuffer().bind().color(@output).unbind()
        @shader = gl.shader
            common: '''//essl
                varying vec2 texcoord;
            '''
            vertex: '''//essl
                attribute vec2 position;

                void main(){
                    texcoord = position*0.5+0.5;
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            '''
            fragment:
                """//essl
                    uniform vec2 viewport;
                    uniform sampler2D source;

                    vec3 get(float x, float y){
                        vec2 off = vec2(x, y);
                        return texture2D(source, texcoord+off/viewport).rgb;
                    }
                    vec3 get(int x, int y){
                        vec2 off = vec2(x, y);
                        return texture2D(source, texcoord+off/viewport).rgb;
                    }
                    vec3 filter(){
                        #{filter}
                    }
                    void main(){
                        gl_FragColor = vec4(filter(), 1.0);
                    }
                """
    bind: (unit) -> @output.bind unit
    apply: (source) ->
        @framebuffer.bind()
        gl.viewport 0, 0, @size, @size
        @shader
            .use()
            .vec2('viewport', @size, @size)
            .sampler('source', source)
            .draw(quad)
        @framebuffer.unbind()

downsample128 = new Filter 128, '''//essl
    return get(0.0, 0.0);
'''

downsample64 = new Filter 64, '''//essl
    return get(0.0, 0.0);
'''

boxFilter = new Filter 64, '''//essl
    vec3 result = vec3(0.0);
    for(int x=-1; x<=1; x++){
        for(int y=-1; y<=1; y++){
            result += get(x,y);
        }
    }
    return result/9.0;
'''

## matrix setup ##
camProj = gl.mat4()
camView = gl.mat4()
lightProj = gl.mat4().perspective(fov:60, 1, near:0.01, far:100)
lightView = gl.mat4().trans(0, 0, -6).rotatex(30).rotatey(110)
lightRot = gl.mat3().fromMat4Rot(lightView)
model = gl.mat4()

## state variables ##
counter = -Math.PI*0.5
offset = 0
camDist = 10
camRot = 55
camPitch = 41

## mouse handling ##
mouseup = -> $(document).unbind('mousemove', mousemove).unbind('mouseup', mouseup)
mousemove = ({originalEvent}) ->
    x = originalEvent.movementX ? originalEvent.webkitMovementX ? originalEvent.mozMovementX ? originalEvent.oMovementX
    y = originalEvent.movementY ? originalEvent.webkitMovementY ? originalEvent.mozMovementY ? originalEvent.oMovementY
    camRot += x
    camPitch += y
    if camPitch > 85 then camPitch = 85
    else if camPitch < 1 then camPitch = 1

$(canvas)
    .bind 'mousedown', ->
        $(document).bind('mousemove', mousemove).bind('mouseup', mouseup)
        return false

    .bind 'mousewheel', ({originalEvent}) ->
        camDist -= originalEvent.wheelDeltaY/250
        return false
    .bind 'DOMMouseScroll', ({originalEvent}) ->
        camDist += originalEvent.detail/5
        return false

## drawing methods ##
drawScene = (shader) ->
    shader
        .mat4('model', model.ident().trans(0, 0, 0))
        .draw(planeGeom)
        .mat4('model', model.ident().trans(0, 1+offset, 0))
        .draw(cubeGeom)
        .mat4('model', model.ident().trans(5, 1, -1))
        .draw(cubeGeom)

drawLight = ->
    lightFramebuffer.bind()
    gl
        .viewport(0, 0, lightDepthTexture.width, lightDepthTexture.height)
        .clearColor(1,1,1,1)
        .clearDepth(1)
        .cullFace('back')

    lightShader.use()
        .mat4('lightView', lightView)
        .mat4('lightProj', lightProj)
        .mat3('lightRot', lightRot)
    drawScene lightShader
    lightFramebuffer.unbind()

    downsample128.apply lightDepthTexture
    downsample64.apply downsample128
    boxFilter.apply downsample64

drawCamera = ->
    gl
        .adjustSize()
        .viewport()
        .cullFace('back')
        .clearColor(0,0,0,0)
        .clearDepth(1)

    camProj.perspective(fov:60, aspect:gl.aspect, near:0.01, far:100)
    camView.ident().trans(0, -1, -camDist).rotatex(camPitch).rotatey(camRot)

    displayShader.use()
        .mat4('camProj', camProj)
        .mat4('camView', camView)
        .mat4('lightView', lightView)
        .mat4('lightProj', lightProj)
        .mat3('lightRot', lightRot)
        .sampler('sLightDepth', boxFilter)
    drawScene displayShader

draw = ->
    drawLight()
    drawCamera()

## mainloop ##
draw()
gl.animationInterval ->
    if hover
        if animate
            offset = 1 + Math.sin(counter)
            counter += 1/30
        else
            offset = 0
        draw()

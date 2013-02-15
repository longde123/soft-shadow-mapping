(function() {
  var Depthbuffer, Drawable, Framebuffer, Mat3, Mat4, Renderbuffer, Shader, Texture, WebGLFramework, arc, deg, getVendorAttrib, pi, raf, tau, vendorName, vendors,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  pi = Math.PI;

  tau = 2 * pi;

  deg = 360 / tau;

  arc = tau / 360;

  Mat3 = (function() {

    function Mat3(data) {
      var _ref;
      this.data = data;
      if ((_ref = this.data) == null) {
        this.data = new Float32Array(9);
      }
      this.ident();
    }

    Mat3.prototype.ident = function() {
      var d;
      d = this.data;
      d[0] = 1;
      d[1] = 0;
      d[2] = 0;
      d[3] = 0;
      d[4] = 1;
      d[5] = 0;
      d[6] = 0;
      d[7] = 0;
      d[8] = 1;
      return this;
    };

    Mat3.prototype.transpose = function() {
      var a01, a02, a12, d;
      d = this.data;
      a01 = d[1];
      a02 = d[2];
      a12 = d[5];
      d[1] = d[3];
      d[2] = d[6];
      d[3] = a01;
      d[5] = d[7];
      d[6] = a02;
      d[7] = a12;
      return this;
    };

    Mat3.prototype.mulVec3 = function(vec, dst) {
      if (dst == null) {
        dst = vec;
      }
      this.mulVal3(vec.x, vec.y, vec.z, dst);
      return dst;
    };

    Mat3.prototype.mulVal3 = function(x, y, z, dst) {
      var d;
      dst = dst.data;
      d = this.data;
      dst[0] = d[0] * x + d[3] * y + d[6] * z;
      dst[1] = d[1] * x + d[4] * y + d[7] * z;
      dst[2] = d[2] * x + d[5] * y + d[8] * z;
      return this;
    };

    Mat3.prototype.rotatex = function(angle) {
      var c, s;
      s = Math.sin(angle * arc);
      c = Math.cos(angle * arc);
      return this.amul(1, 0, 0, 0, c, s, 0, -s, c);
    };

    Mat3.prototype.rotatey = function(angle) {
      var c, s;
      s = Math.sin(angle * arc);
      c = Math.cos(angle * arc);
      return this.amul(c, 0, -s, 0, 1, 0, s, 0, c);
    };

    Mat3.prototype.rotatez = function(angle) {
      var c, s;
      s = Math.sin(angle * arc);
      c = Math.cos(angle * arc);
      return this.amul(c, s, 0, -s, c, 0, 0, 0, 1);
    };

    Mat3.prototype.amul = function(b00, b10, b20, b01, b11, b21, b02, b12, b22, b03, b13, b23) {
      var a, a00, a01, a02, a10, a11, a12, a20, a21, a22;
      a = this.data;
      a00 = a[0];
      a10 = a[1];
      a20 = a[2];
      a01 = a[3];
      a11 = a[4];
      a21 = a[5];
      a02 = a[6];
      a12 = a[7];
      a22 = a[8];
      a[0] = a00 * b00 + a01 * b10 + a02 * b20;
      a[1] = a10 * b00 + a11 * b10 + a12 * b20;
      a[2] = a20 * b00 + a21 * b10 + a22 * b20;
      a[3] = a00 * b01 + a01 * b11 + a02 * b21;
      a[4] = a10 * b01 + a11 * b11 + a12 * b21;
      a[5] = a20 * b01 + a21 * b11 + a22 * b21;
      a[6] = a00 * b02 + a01 * b12 + a02 * b22;
      a[7] = a10 * b02 + a11 * b12 + a12 * b22;
      a[8] = a20 * b02 + a21 * b12 + a22 * b22;
      return this;
    };

    Mat3.prototype.fromMat4Rot = function(source) {
      return source.toMat3Rot(this);
    };

    Mat3.prototype.log = function() {
      var d;
      d = this.data;
      return console.log('%f, %f, %f,\n%f, %f, %f, \n%f, %f, %f, ', d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8]);
    };

    return Mat3;

  })();

  Mat4 = (function() {

    function Mat4(data) {
      var _ref;
      this.data = data;
      if ((_ref = this.data) == null) {
        this.data = new Float32Array(16);
      }
      this.ident();
    }

    Mat4.prototype.ident = function() {
      var d;
      d = this.data;
      d[0] = 1;
      d[1] = 0;
      d[2] = 0;
      d[3] = 0;
      d[4] = 0;
      d[5] = 1;
      d[6] = 0;
      d[7] = 0;
      d[8] = 0;
      d[9] = 0;
      d[10] = 1;
      d[11] = 0;
      d[12] = 0;
      d[13] = 0;
      d[14] = 0;
      d[15] = 1;
      return this;
    };

    Mat4.prototype.zero = function() {
      var d;
      d = this.data;
      d[0] = 0;
      d[1] = 0;
      d[2] = 0;
      d[3] = 0;
      d[4] = 0;
      d[5] = 0;
      d[6] = 0;
      d[7] = 0;
      d[8] = 0;
      d[9] = 0;
      d[10] = 0;
      d[11] = 0;
      d[12] = 0;
      d[13] = 0;
      d[14] = 0;
      d[15] = 0;
      return this;
    };

    Mat4.prototype.copy = function(dest) {
      var dst, src;
      src = this.data;
      dst = dest.data;
      dst[0] = src[0];
      dst[1] = src[1];
      dst[2] = src[2];
      dst[3] = src[3];
      dst[4] = src[4];
      dst[5] = src[5];
      dst[6] = src[6];
      dst[7] = src[7];
      dst[8] = src[8];
      dst[9] = src[9];
      dst[10] = src[10];
      dst[11] = src[11];
      dst[12] = src[12];
      dst[13] = src[13];
      dst[14] = src[14];
      dst[15] = src[15];
      return dest;
    };

    Mat4.prototype.toMat3 = function(dest) {
      var dst, src;
      src = this.data;
      dst = dest.data;
      dst[0] = src[0];
      dst[1] = src[1];
      dst[2] = src[2];
      dst[3] = src[4];
      dst[4] = src[5];
      dst[5] = src[6];
      dst[6] = src[8];
      dst[7] = src[9];
      dst[8] = src[10];
      return dest;
    };

    Mat4.prototype.toMat3Rot = function(dest) {
      var a00, a01, a02, a10, a11, a12, a20, a21, a22, b01, b11, b21, d, dst, id, src;
      dst = dest.data;
      src = this.data;
      a00 = src[0];
      a01 = src[1];
      a02 = src[2];
      a10 = src[4];
      a11 = src[5];
      a12 = src[6];
      a20 = src[8];
      a21 = src[9];
      a22 = src[10];
      b01 = a22 * a11 - a12 * a21;
      b11 = -a22 * a10 + a12 * a20;
      b21 = a21 * a10 - a11 * a20;
      d = a00 * b01 + a01 * b11 + a02 * b21;
      id = 1 / d;
      dst[0] = b01 * id;
      dst[3] = (-a22 * a01 + a02 * a21) * id;
      dst[6] = (a12 * a01 - a02 * a11) * id;
      dst[1] = b11 * id;
      dst[4] = (a22 * a00 - a02 * a20) * id;
      dst[7] = (-a12 * a00 + a02 * a10) * id;
      dst[2] = b21 * id;
      dst[5] = (-a21 * a00 + a01 * a20) * id;
      dst[8] = (a11 * a00 - a01 * a10) * id;
      return dest;
    };

    Mat4.prototype.perspective = function(_arg) {
      var aspect, bottom, d, far, fov, left, near, right, top;
      fov = _arg.fov, aspect = _arg.aspect, near = _arg.near, far = _arg.far;
      if (fov == null) {
        fov = 60;
      }
      if (aspect == null) {
        aspect = 1;
      }
      if (near == null) {
        near = 0.01;
      }
      if (far == null) {
        far = 100;
      }
      this.zero();
      d = this.data;
      top = near * Math.tan(fov * Math.PI / 360);
      right = top * aspect;
      left = -right;
      bottom = -top;
      d[0] = (2 * near) / (right - left);
      d[5] = (2 * near) / (top - bottom);
      d[8] = (right + left) / (right - left);
      d[9] = (top + bottom) / (top - bottom);
      d[10] = -(far + near) / (far - near);
      d[11] = -1;
      d[14] = -(2 * far * near) / (far - near);
      return this;
    };

    Mat4.prototype.inversePerspective = function(fov, aspect, near, far) {
      var bottom, dst, left, right, top;
      this.zero();
      dst = this.data;
      top = near * Math.tan(fov * Math.PI / 360);
      right = top * aspect;
      left = -right;
      bottom = -top;
      dst[0] = (right - left) / (2 * near);
      dst[5] = (top - bottom) / (2 * near);
      dst[11] = -(far - near) / (2 * far * near);
      dst[12] = (right + left) / (2 * near);
      dst[13] = (top + bottom) / (2 * near);
      dst[14] = -1;
      dst[15] = (far + near) / (2 * far * near);
      return this;
    };

    Mat4.prototype.ortho = function(near, far, top, bottom, left, right) {
      var fn, rl, tb;
      if (near == null) {
        near = -1;
      }
      if (far == null) {
        far = 1;
      }
      if (top == null) {
        top = -1;
      }
      if (bottom == null) {
        bottom = 1;
      }
      if (left == null) {
        left = -1;
      }
      if (right == null) {
        right = 1;
      }
      rl = right - left;
      tb = top - bottom;
      fn = far - near;
      return this.set(2 / rl, 0, 0, -(left + right) / rl, 0, 2 / tb, 0, -(top + bottom) / tb, 0, 0, -2 / fn, -(far + near) / fn, 0, 0, 0, 1);
    };

    Mat4.prototype.inverseOrtho = function(near, far, top, bottom, left, right) {
      var a, b, c, d, e, f, g;
      if (near == null) {
        near = -1;
      }
      if (far == null) {
        far = 1;
      }
      if (top == null) {
        top = -1;
      }
      if (bottom == null) {
        bottom = 1;
      }
      if (left == null) {
        left = -1;
      }
      if (right == null) {
        right = 1;
      }
      a = (right - left) / 2;
      b = (right + left) / 2;
      c = (top - bottom) / 2;
      d = (top + bottom) / 2;
      e = (far - near) / -2;
      f = (near + far) / 2;
      g = 1;
      return this.set(a, 0, 0, b, 0, c, 0, d, 0, 0, e, f, 0, 0, 0, g);
    };

    Mat4.prototype.fromRotationTranslation = function(quat, vec) {
      var dest, w, wx, wy, wz, x, x2, xx, xy, xz, y, y2, yy, yz, z, z2, zz;
      x = quat.x;
      y = quat.y;
      z = quat.z;
      w = quat.w;
      x2 = x + x;
      y2 = y + y;
      z2 = z + z;
      xx = x * x2;
      xy = x * y2;
      xz = x * z2;
      yy = y * y2;
      yz = y * z2;
      zz = z * z2;
      wx = w * x2;
      wy = w * y2;
      wz = w * z2;
      dest = this.data;
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
      dest[12] = vec.x;
      dest[13] = vec.y;
      dest[14] = vec.z;
      dest[15] = 1;
      return this;
    };

    Mat4.prototype.trans = function(x, y, z) {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, d;
      d = this.data;
      a00 = d[0];
      a01 = d[1];
      a02 = d[2];
      a03 = d[3];
      a10 = d[4];
      a11 = d[5];
      a12 = d[6];
      a13 = d[7];
      a20 = d[8];
      a21 = d[9];
      a22 = d[10];
      a23 = d[11];
      d[12] = a00 * x + a10 * y + a20 * z + d[12];
      d[13] = a01 * x + a11 * y + a21 * z + d[13];
      d[14] = a02 * x + a12 * y + a22 * z + d[14];
      d[15] = a03 * x + a13 * y + a23 * z + d[15];
      return this;
    };

    Mat4.prototype.rotatex = function(angle) {
      var a10, a11, a12, a13, a20, a21, a22, a23, c, d, rad, s;
      d = this.data;
      rad = tau * (angle / 360);
      s = Math.sin(rad);
      c = Math.cos(rad);
      a10 = d[4];
      a11 = d[5];
      a12 = d[6];
      a13 = d[7];
      a20 = d[8];
      a21 = d[9];
      a22 = d[10];
      a23 = d[11];
      d[4] = a10 * c + a20 * s;
      d[5] = a11 * c + a21 * s;
      d[6] = a12 * c + a22 * s;
      d[7] = a13 * c + a23 * s;
      d[8] = a10 * -s + a20 * c;
      d[9] = a11 * -s + a21 * c;
      d[10] = a12 * -s + a22 * c;
      d[11] = a13 * -s + a23 * c;
      return this;
    };

    Mat4.prototype.rotatey = function(angle) {
      var a00, a01, a02, a03, a20, a21, a22, a23, c, d, rad, s;
      d = this.data;
      rad = tau * (angle / 360);
      s = Math.sin(rad);
      c = Math.cos(rad);
      a00 = d[0];
      a01 = d[1];
      a02 = d[2];
      a03 = d[3];
      a20 = d[8];
      a21 = d[9];
      a22 = d[10];
      a23 = d[11];
      d[0] = a00 * c + a20 * -s;
      d[1] = a01 * c + a21 * -s;
      d[2] = a02 * c + a22 * -s;
      d[3] = a03 * c + a23 * -s;
      d[8] = a00 * s + a20 * c;
      d[9] = a01 * s + a21 * c;
      d[10] = a02 * s + a22 * c;
      d[11] = a03 * s + a23 * c;
      return this;
    };

    Mat4.prototype.rotatez = function(angle) {
      var a00, a01, a02, a03, a10, a11, a12, a13, c, d, rad, s;
      d = this.data;
      rad = tau * (angle / 360);
      s = Math.sin(rad);
      c = Math.cos(rad);
      a00 = d[0];
      a01 = d[1];
      a02 = d[2];
      a03 = d[3];
      a10 = d[4];
      a11 = d[5];
      a12 = d[6];
      a13 = d[7];
      d[0] = a00 * c + a10 * s;
      d[1] = a01 * c + a11 * s;
      d[2] = a02 * c + a12 * s;
      d[3] = a03 * c + a13 * s;
      d[4] = a00 * -s + a10 * c;
      d[5] = a01 * -s + a11 * c;
      d[6] = a02 * -s + a12 * c;
      d[7] = a03 * -s + a13 * c;
      return this;
    };

    Mat4.prototype.scale = function(scalar) {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, d;
      d = this.data;
      a00 = d[0];
      a01 = d[1];
      a02 = d[2];
      a03 = d[3];
      a10 = d[4];
      a11 = d[5];
      a12 = d[6];
      a13 = d[7];
      a20 = d[8];
      a21 = d[9];
      a22 = d[10];
      a23 = d[11];
      d[0] = a00 * scalar;
      d[1] = a01 * scalar;
      d[2] = a02 * scalar;
      d[3] = a03 * scalar;
      d[4] = a10 * scalar;
      d[5] = a11 * scalar;
      d[6] = a12 * scalar;
      d[7] = a13 * scalar;
      d[8] = a20 * scalar;
      d[9] = a21 * scalar;
      d[10] = a22 * scalar;
      d[11] = a23 * scalar;
      return this;
    };

    Mat4.prototype.mulMat4 = function(other, dst) {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3, dest, mat, mat2;
      if (dst == null) {
        dst = this;
      }
      dest = dst.data;
      mat = this.data;
      mat2 = other.data;
      a00 = mat[0];
      a01 = mat[1];
      a02 = mat[2];
      a03 = mat[3];
      a10 = mat[4];
      a11 = mat[5];
      a12 = mat[6];
      a13 = mat[7];
      a20 = mat[8];
      a21 = mat[9];
      a22 = mat[10];
      a23 = mat[11];
      a30 = mat[12];
      a31 = mat[13];
      a32 = mat[14];
      a33 = mat[15];
      b0 = mat2[0];
      b1 = mat2[1];
      b2 = mat2[2];
      b3 = mat2[3];
      dest[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      dest[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      dest[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      dest[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = mat2[4];
      b1 = mat2[5];
      b2 = mat2[6];
      b3 = mat2[7];
      dest[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      dest[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      dest[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      dest[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = mat2[8];
      b1 = mat2[9];
      b2 = mat2[10];
      b3 = mat2[11];
      dest[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      dest[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      dest[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      dest[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = mat2[12];
      b1 = mat2[13];
      b2 = mat2[14];
      b3 = mat2[15];
      dest[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      dest[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      dest[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      dest[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return dst;
    };

    Mat4.prototype.mulVec3 = function(vec, dst) {
      if (dst == null) {
        dst = vec;
      }
      return this.mulVal3(vec.x, vec.y, vec.z, dst);
    };

    Mat4.prototype.mulVal3 = function(x, y, z, dst) {
      var d;
      dst = dst.data;
      d = this.data;
      dst[0] = d[0] * x + d[4] * y + d[8] * z;
      dst[1] = d[1] * x + d[5] * y + d[9] * z;
      dst[2] = d[2] * x + d[6] * y + d[10] * z;
      return dst;
    };

    Mat4.prototype.mulVec4 = function(vec, dst) {
      if (dst == null) {
        dst = vec;
      }
      return this.mulVal4(vec.x, vec.y, vec.z, vec.w, dst);
    };

    Mat4.prototype.mulVal4 = function(x, y, z, w, dst) {
      var d;
      dst = dst.data;
      d = this.data;
      dst[0] = d[0] * x + d[4] * y + d[8] * z + d[12] * w;
      dst[1] = d[1] * x + d[5] * y + d[9] * z + d[13] * w;
      dst[2] = d[2] * x + d[6] * y + d[10] * z + d[14] * w;
      dst[3] = d[3] * x + d[7] * y + d[11] * z + d[15] * w;
      return dst;
    };

    Mat4.prototype.invert = function(dst) {
      var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, d, dest, invDet, mat;
      if (dst == null) {
        dst = this;
      }
      mat = this.data;
      dest = dst.data;
      a00 = mat[0];
      a01 = mat[1];
      a02 = mat[2];
      a03 = mat[3];
      a10 = mat[4];
      a11 = mat[5];
      a12 = mat[6];
      a13 = mat[7];
      a20 = mat[8];
      a21 = mat[9];
      a22 = mat[10];
      a23 = mat[11];
      a30 = mat[12];
      a31 = mat[13];
      a32 = mat[14];
      a33 = mat[15];
      b00 = a00 * a11 - a01 * a10;
      b01 = a00 * a12 - a02 * a10;
      b02 = a00 * a13 - a03 * a10;
      b03 = a01 * a12 - a02 * a11;
      b04 = a01 * a13 - a03 * a11;
      b05 = a02 * a13 - a03 * a12;
      b06 = a20 * a31 - a21 * a30;
      b07 = a20 * a32 - a22 * a30;
      b08 = a20 * a33 - a23 * a30;
      b09 = a21 * a32 - a22 * a31;
      b10 = a21 * a33 - a23 * a31;
      b11 = a22 * a33 - a23 * a32;
      d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (d === 0) {
        return;
      }
      invDet = 1 / d;
      dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
      return dst;
    };

    Mat4.prototype.set = function(a00, a10, a20, a30, a01, a11, a21, a31, a02, a12, a22, a32, a03, a13, a23, a33) {
      var d;
      d = this.data;
      d[0] = a00;
      d[4] = a10;
      d[8] = a20;
      d[12] = a30;
      d[1] = a01;
      d[5] = a11;
      d[9] = a21;
      d[13] = a31;
      d[2] = a02;
      d[6] = a12;
      d[10] = a22;
      d[14] = a32;
      d[3] = a03;
      d[7] = a13;
      d[11] = a23;
      d[15] = a33;
      return this;
    };

    return Mat4;

  })();

  Shader = (function() {
    var boilerplate;

    boilerplate = 'precision highp int;\nprecision highp float;\nprecision highp vec2;\nprecision highp vec3;\nprecision highp vec4;\n#define PI 3.141592653589793\n#define TAU 6.283185307179586\n#define PIH 1.5707963267948966';

    function Shader(framework, _arg) {
      var common, fragment, vertex;
      this.framework = framework;
      common = _arg.common, vertex = _arg.vertex, fragment = _arg.fragment;
      this.gl = this.framework.gl;
      this.program = this.gl.createProgram();
      this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.attachShader(this.program, this.vs);
      this.gl.attachShader(this.program, this.fs);
      if (common == null) {
        common = '';
      }
      this.compileShader(this.vs, [common, vertex].join('\n'));
      this.compileShader(this.fs, [common, fragment].join('\n'));
      this.link();
      this.uniformCache = {};
      this.attributeCache = {};
      this.samplers = {};
      this.unitCounter = 0;
    }

    Shader.prototype.compileShader = function(shader, source) {
      var error, lines, _ref;
      source = [boilerplate, source].join('\n');
      _ref = this.preprocess(source), source = _ref[0], lines = _ref[1];
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        error = this.gl.getShaderInfoLog(shader);
        throw this.translateError(error, lines);
      }
    };

    Shader.prototype.preprocess = function(source) {
      var filename, line, lineno, lines, match, result, _i, _len, _ref;
      lines = [];
      result = [];
      filename = 'no file';
      lineno = 1;
      _ref = source.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        match = line.match(/#line (\d+) (.*)/);
        if (match) {
          lineno = parseInt(match[1], 10) + 1;
          filename = match[2];
        } else {
          lines.push({
            source: line,
            lineno: lineno,
            filename: filename
          });
          result.push(line);
          lineno += 1;
        }
      }
      return [result.join('\n'), lines];
    };

    Shader.prototype.translateError = function(error, lines) {
      var i, line, lineno, match, message, result, sourceline, _i, _len, _ref;
      result = ['Shader Compile Error'];
      _ref = error.split('\n');
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        line = _ref[i];
        match = line.match(/ERROR: \d+:(\d+): (.*)/);
        if (match) {
          lineno = parseFloat(match[1]) - 1;
          message = match[2];
          sourceline = lines[lineno];
          result.push("File \"" + sourceline.filename + "\", Line " + sourceline.lineno + ", " + message);
          result.push("   " + sourceline.source);
        } else {
          result.push(line);
        }
      }
      return result.join('\n');
    };

    Shader.prototype.link = function() {
      this.gl.linkProgram(this.program);
      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        throw "Shader Link Error: " + (this.gl.getProgramInfoLog(this.program));
      }
    };

    Shader.prototype.attributeLocation = function(name) {
      var location;
      location = this.attributeCache[name];
      if (location === void 0) {
        location = this.attributeCache[name] = this.gl.getAttribLocation(this.program, name);
      }
      return location;
    };

    Shader.prototype.uniformLocation = function(name) {
      var location;
      location = this.uniformCache[name];
      if (location === void 0) {
        location = this.uniformCache[name] = this.gl.getUniformLocation(this.program, name);
      }
      return location;
    };

    Shader.prototype.use = function() {
      if (this.framework.currentShader !== this) {
        this.framework.currentShader = this;
        this.gl.useProgram(this.program);
      }
      return this;
    };

    Shader.prototype.draw = function(drawable) {
      drawable.setPointersForShader(this).draw();
      return this;
    };

    Shader.prototype.int = function(name, value) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        this.gl.uniform1i(loc, value);
      }
      return this;
    };

    Shader.prototype.sampler = function(name, texture) {
      var unit;
      unit = this.samplers[name];
      if (unit === void 0) {
        unit = this.samplers[name] = this.unitCounter++;
      }
      texture.bind(unit);
      this.int(name, unit);
      return this;
    };

    Shader.prototype.vec2 = function(name, a, b) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        this.gl.uniform2f(loc, a, b);
      }
      return this;
    };

    Shader.prototype.vec3 = function(name, a, b, c) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        this.gl.uniform3f(loc, a, b, f);
      }
      return this;
    };

    Shader.prototype.mat4 = function(name, value) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        if (value instanceof Mat4) {
          this.gl.uniformMatrix4fv(loc, this.gl.FALSE, value.data);
        } else {
          this.gl.uniformMatrix4fv(loc, this.gl.FALSE, value);
        }
      }
      return this;
    };

    Shader.prototype.mat3 = function(name, value) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        if (value instanceof Mat3) {
          this.gl.uniformMatrix3fv(loc, this.gl.FALSE, value.data);
        } else {
          this.gl.uniformMatrix3fv(loc, this.gl.FALSE, value);
        }
      }
      return this;
    };

    Shader.prototype.float = function(name, value) {
      var loc;
      loc = this.uniformLocation(name);
      if (loc) {
        this.gl.uniform1f(loc, value);
      }
      return this;
    };

    return Shader;

  })();

  Drawable = (function() {
    var float_size;

    float_size = Float32Array.BYTES_PER_ELEMENT;

    function Drawable(framework, _arg) {
      var pointer, vertices, _i, _len, _ref, _ref1;
      this.framework = framework;
      this.pointers = _arg.pointers, vertices = _arg.vertices, this.mode = _arg.mode;
      this.gl = this.framework.gl;
      this.buffer = this.gl.createBuffer();
      if ((_ref = this.mode) == null) {
        this.mode = this.gl.TRIANGLES;
      }
      this.vertexSize = 0;
      _ref1 = this.pointers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        pointer = _ref1[_i];
        this.vertexSize += pointer.size;
      }
      this.upload(vertices);
    }

    Drawable.prototype.upload = function(vertices) {
      var data;
      if (vertices instanceof Array) {
        data = new Float32Array(vertices);
      } else {
        data = vertices;
      }
      this.size = data.length / this.vertexSize;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
      return this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };

    Drawable.prototype.setPointer = function(shader, pointer, idx) {
      var location, unit;
      location = shader.attributeLocation(pointer.name);
      if (location >= 0) {
        unit = this.framework.vertexUnits[location];
        if (!unit.enabled) {
          unit.enabled = true;
          this.gl.enableVertexAttribArray(location);
        }
        if (unit.drawable !== this || unit.idx !== idx) {
          unit.idx = idx;
          unit.drawable = this;
          this.gl.vertexAttribPointer(location, pointer.size, this.gl.FLOAT, false, pointer.stride * float_size, pointer.offset * float_size);
        }
      }
      return this;
    };

    Drawable.prototype.setPointersForShader = function(shader) {
      var i, pointer, _i, _len, _ref;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      _ref = this.pointers;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        pointer = _ref[i];
        this.setPointer(shader, pointer, i);
      }
      return this;
    };

    Drawable.prototype.draw = function(first, size, mode) {
      if (first == null) {
        first = 0;
      }
      if (size == null) {
        size = this.size;
      }
      if (mode == null) {
        mode = this.mode;
      }
      this.gl.drawArrays(mode, first, size);
      return this;
    };

    return Drawable;

  })();

  Texture = (function() {

    function Texture(framework, params) {
      var _ref, _ref1;
      this.framework = framework;
      if (params == null) {
        params = {};
      }
      this.gl = this.framework.gl;
      this.channels = this.gl[((_ref = params.channels) != null ? _ref : 'rgb').toUpperCase()];
      this.type = this.gl[((_ref1 = params.type) != null ? _ref1 : 'unsigned_byte').toUpperCase()];
      this.target = this.gl.TEXTURE_2D;
      this.handle = this.gl.createTexture();
    }

    Texture.prototype.destroy = function() {
      return this.gl.deleteTexture(this.handle);
    };

    Texture.prototype.bind = function(unit) {
      if (unit == null) {
        unit = 0;
      }
      if (unit > 15) {
        throw 'Texture unit too large: ' + unit;
      }
      this.gl.activeTexture(this.gl.TEXTURE0 + unit);
      this.gl.bindTexture(this.target, this.handle);
      return this;
    };

    Texture.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
      this.gl.texImage2D(this.target, 0, this.channels, this.width, this.height, 0, this.channels, this.type, null);
      return this;
    };

    Texture.prototype.linear = function() {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      return this;
    };

    Texture.prototype.nearest = function() {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      return this;
    };

    Texture.prototype.clampToEdge = function() {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      return this;
    };

    Texture.prototype.repeat = function() {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
      return this;
    };

    return Texture;

  })();

  Framebuffer = (function() {

    function Framebuffer(framework) {
      this.framework = framework;
      this.gl = this.framework.gl;
      this.buffer = this.gl.createFramebuffer();
      this.ownDepth = false;
    }

    Framebuffer.prototype.destroy = function() {
      return this.gl.deleteFRamebuffer(this.buffer);
    };

    Framebuffer.prototype.bind = function() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
      return this;
    };

    Framebuffer.prototype.unbind = function() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return this;
    };

    Framebuffer.prototype.check = function() {
      var result;
      result = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
      switch (result) {
        case this.gl.FRAMEBUFFER_UNSUPPORTED:
          throw 'Framebuffer is unsupported';
          break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
          throw 'Framebuffer incomplete attachment';
          break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
          throw 'Framebuffer incomplete dimensions';
          break;
        case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
          throw 'Framebuffer incomplete missing attachment';
      }
      return this;
    };

    Framebuffer.prototype.color = function(colorTexture) {
      this.colorTexture = colorTexture;
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.colorTexture.target, this.colorTexture.handle, 0);
      this.check();
      return this;
    };

    Framebuffer.prototype.depth = function(depthBuffer) {
      this.depthBuffer = depthBuffer;
      if (this.depthBuffer === void 0) {
        if (this.colorTexture === void 0) {
          throw 'Cannot create implicit depth buffer without a color texture';
        } else {
          this.ownDepth = true;
          this.depthBuffer = this.framework.depthbuffer().bind().setSize(this.colorTexture.width, this.colorTexture.height);
        }
      }
      this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer.id);
      this.check();
      return this;
    };

    Framebuffer.prototype.destroy = function() {
      this.gl.deleteFramebuffer(this.buffer);
      if (this.ownDepth) {
        return this.depthBuffer.destroy();
      }
    };

    return Framebuffer;

  })();

  Renderbuffer = (function() {

    function Renderbuffer(framework) {
      this.framework = framework;
      this.gl = this.framework.gl;
      this.id = this.gl.createRenderbuffer();
    }

    Renderbuffer.prototype.bind = function() {
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.id);
      return this;
    };

    Renderbuffer.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
      this.bind();
      this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl[this.format], this.width, this.height);
      return this.unbind();
    };

    Renderbuffer.prototype.unbind = function() {
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      return this;
    };

    Renderbuffer.prototype.destroy = function() {
      return this.gl.deleteRenderbuffer(this.id);
    };

    return Renderbuffer;

  })();

  Depthbuffer = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.format = 'DEPTH_COMPONENT16';

    return _Class;

  })(Renderbuffer);

  raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  performance.now = performance.now || performance.mozNow || performance.webkitNow || performance.oNow;

  window.WebGLFramework = WebGLFramework = (function() {

    function WebGLFramework(canvas, params) {
      var _, _i, _j;
      this.canvas = canvas;
      this.animationInterval = __bind(this.animationInterval, this);

      try {
        this.gl = this.canvas.getContext('experimental-webgl', params);
        if (this.gl === null) {
          this.gl = this.canvas.getContext('webgl', params);
          if (this.gl === null) {
            throw 'WebGL not supported';
          }
        }
      } catch (error) {
        throw 'WebGL not supported';
      }
      this.textureUnits = [];
      for (_ = _i = 0; _i < 16; _ = ++_i) {
        this.textureUnits.push(null);
      }
      this.vertexUnits = [];
      for (_ = _j = 0; _j < 16; _ = ++_j) {
        this.vertexUnits.push({
          enabled: false,
          drawable: null,
          idx: null
        });
      }
      this.currentShader = null;
    }

    WebGLFramework.prototype.shader = function(params) {
      return new Shader(this, params);
    };

    WebGLFramework.prototype.drawable = function(params) {
      return new Drawable(this, params);
    };

    WebGLFramework.prototype.texture = function(params) {
      return new Texture(this, params);
    };

    WebGLFramework.prototype.framebuffer = function() {
      return new Framebuffer(this);
    };

    WebGLFramework.prototype.depthbuffer = function() {
      return new Depthbuffer(this);
    };

    WebGLFramework.prototype.mat3 = function(data) {
      return new Mat3(data);
    };

    WebGLFramework.prototype.mat4 = function(data) {
      return new Mat4(data);
    };

    WebGLFramework.prototype.clearColor = function(r, g, b, a) {
      if (r == null) {
        r = 0;
      }
      if (g == null) {
        g = 0;
      }
      if (b == null) {
        b = 0;
      }
      if (a == null) {
        a = 1;
      }
      this.gl.clearColor(r, g, b, a);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      return this;
    };

    WebGLFramework.prototype.clearDepth = function(depth) {
      if (depth == null) {
        depth = 1;
      }
      this.gl.clearDepth(depth);
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
      return this;
    };

    WebGLFramework.prototype.adjustSize = function() {
      var canvasHeight, canvasWidth;
      canvasWidth = this.canvas.offsetWidth || 2;
      canvasHeight = this.canvas.offsetHeight || 2;
      if (this.width !== canvasWidth || this.height !== canvasHeight) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.aspect = this.width / this.height;
      }
      return this;
    };

    WebGLFramework.prototype.viewport = function(left, top, width, height) {
      if (left == null) {
        left = 0;
      }
      if (top == null) {
        top = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      this.gl.viewport(left, top, width, height);
      return this;
    };

    WebGLFramework.prototype.depthTest = function(value) {
      if (value == null) {
        value = true;
      }
      if (value) {
        this.gl.enable(this.gl.DEPTH_TEST);
      } else {
        this.gl.disable(this.gl.DEPTH_TEST);
      }
      return this;
    };

    WebGLFramework.prototype.animationInterval = function(callback) {
      var interval;
      interval = function() {
        callback();
        return raf(interval);
      };
      return raf(interval);
    };

    WebGLFramework.prototype.now = function() {
      return performance.now() / 1000;
    };

    WebGLFramework.prototype.getExt = function(name) {
      var ext;
      ext = this.gl.getExtension(name);
      if (!ext) {
        throw "WebGL Extension not supported: " + name;
      }
      return ext;
    };

    WebGLFramework.prototype.requestFullscreen = function(elem) {
      if (elem == null) {
        elem = this.canvas;
      }
      if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
      } else if (elem.oRequestFullScreen) {
        elem.oRequestFullScreen();
      }
      return this;
    };

    WebGLFramework.prototype.isFullscreen = function() {
      var a, b;
      a = getVendorAttrib(document, 'fullscreenElement');
      b = getVendorAttrib(document, 'fullScreenElement');
      if (a || b) {
        return true;
      } else {
        return false;
      }
    };

    WebGLFramework.prototype.onFullscreenChange = function(fun) {
      var callback, vendor, _i, _len,
        _this = this;
      callback = function() {
        return fun(_this.isFullscreen());
      };
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        vendor = vendors[_i];
        document.addEventListener(vendor + 'fullscreenchange', callback, false);
      }
      return this;
    };

    WebGLFramework.prototype.exitFullscreen = function() {
      document.cancelFullscreen();
      return this;
    };

    WebGLFramework.prototype.toggleFullscreen = function(elem) {
      if (elem == null) {
        elem = this.canvas;
      }
      if (this.isFullscreen()) {
        return this.exitFullscreen();
      } else {
        return this.requestFullscreen(elem);
      }
    };

    WebGLFramework.prototype.assertFloatRenderTarget = function(channels) {
      var fbo, texture;
      if (channels == null) {
        channels = 'rgba';
      }
      texture = this.texture({
        type: 'float',
        channels: channels
      }).bind().setSize(2, 2).linear();
      fbo = this.framebuffer();
      try {
        return fbo.bind().color(texture).unbind();
      } catch (error) {
        throw 'Floating point render target not supported';
      } finally {
        fbo.destroy();
        texture.destroy();
      }
    };

    WebGLFramework.prototype.cullFace = function(value) {
      if (value == null) {
        value = 'back';
      }
      if (value) {
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl[value.toUpperCase()]);
      } else {
        this.gl.disable(this.gl.CULL_FACE);
      }
      return this;
    };

    return WebGLFramework;

  })();

  vendors = [null, 'webkit', 'apple', 'moz', 'o', 'xv', 'ms', 'khtml', 'atsc', 'wap', 'prince', 'ah', 'hp', 'ro', 'rim', 'tc'];

  vendorName = function(name, vendor) {
    if (vendor === null) {
      return name;
    } else {
      return vendor + name[0].toUpperCase() + name.substr(1);
    }
  };

  getVendorAttrib = function(obj, name, def) {
    var attrib, attrib_name, vendor, _i, _len;
    if (obj) {
      for (_i = 0, _len = vendors.length; _i < _len; _i++) {
        vendor = vendors[_i];
        attrib_name = vendorName(name, vendor);
        attrib = obj[attrib_name];
        if (attrib !== void 0) {
          return attrib;
        }
      }
    }
    return def;
  };

  document.fullscreenEnabled = getVendorAttrib(document, 'fullscreenEnabled');

  document.cancelFullscreen = getVendorAttrib(document, 'cancelFullScreen');

}).call(this);

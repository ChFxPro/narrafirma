import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// Calculates Kendall's tau, a correlation measure for ordinal data, and an associated p-value.
// Returns: Kendall's tau, two-tailed p-value
// Derived from older SciPy: http://web.mit.edu/6.863/spring2011/packages/scipy_src/scipy/stats/stats.py
function kendallsTau(x: number[], y: number[]) {
    var n1 = 0;
    var n2 = 0;
    var iss = 0;
    for (var j = 0; j < x.length -1; j++) {
        for (var k = j + 1; k < y.length; k++) {
            var a1 = x[j] - x[k];
            var a2 = y[j] - y[k];
            var aa = a1 * a2;
            if (aa) {
                // neither array has a tie
                n1 = n1 + 1;
                n2 = n2 + 1;
                if (aa > 0) {
                    iss = iss + 1;
                } else {
                    iss = iss - 1;
                }
            } else {
                if (a1) {
                    n1 = n1 + 1;
                }
                if (a2) {
                    n2 = n2 + 1;
                }
           }
       }
    }
    var tau = iss / Math.sqrt(n1 * n2);
    var svar = (4.0 * x.length + 10.0) / (9.0* x.length * (x.length -1));
    var z = tau / Math.sqrt(svar);
    var prob = erfc(Math.abs(z) / 1.4142136);
    return {test: tau, z: z, prob: prob};
}

// From JStat (MIT License)
// Returns the error function erf(x)
function erf(x) {
  var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
             -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
             4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
             1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
             6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
             -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
             -6.886027e-12, 8.94487e-13, 3.13092e-13,
             -1.12708e-13, 3.81e-16, 7.106e-15,
             -1.523e-15, -9.4e-17, 1.21e-16,
             -2.8e-17];
  var j = cof.length - 1;
  var isneg = false;
  var d = 0;
  var dd = 0;
  var t, ty, tmp, res;

  if (x < 0) {
    x = -x;
    isneg = true;
  }

  t = 2 / (2 + x);
  ty = 4 * t - 2;

  for(; j > 0; j--) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }

  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
  return isneg ? res - 1 : 1 - res;
}

// Returns the complmentary error function erfc(x)
function erfc(x) {
  return 1 - erf(x);
}

export = kendallsTau;
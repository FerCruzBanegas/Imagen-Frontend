module.exports = (function (id) {
  let pad = '000000';
  let pad_pos = 'l';
  if (typeof id === 'undefined') return pad;
  if (pad_pos == 'l') {
     return (pad + id).slice(-pad.length);
  }
  else {
    return (id + pad).substring(0, pad.length);
  }
})
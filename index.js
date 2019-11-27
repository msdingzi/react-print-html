const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend(
    {
      noPrint: '.no-print',
      type: 'window',
    },
    options,
  );

  if (typeof dom === 'string') {
    this.dom = document.querySelector(dom);
  } else {
    this.dom = dom;
  }

  this.init();
};
Print.prototype = {
  init() {
    const content = this.getStyle() + this.getHtml();
    if (this.options.type === 'iframe') {
      this.writeIframe(content);
    } else {
      this.writeDocument(content);
    }
  },
  extend(obj, obj2) {
    for (const k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle() {
    let str = '';


    const styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str +=
      `<style>${
      this.options.noPrint ? this.options.noPrint : '.no-print'
      }{display:none;}</style>`;

    return str;
  },

  getHtml() {
    const inputs = document.querySelectorAll('input');
    const textareas = document.querySelectorAll('textarea');
    const selects = document.querySelectorAll('select');

    for (const k in inputs) {
      if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
        if (inputs[k].checked === true) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type === 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (const k2 in textareas) {
      if (textareas[k2].type === 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (const k3 in selects) {
      if (selects[k3].type === 'select-one') {
        const child = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName === 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', 'selected');
            } else {
              child[i].removeAttribute('selected');
            }
          }
        }
      }
    }

    return this.dom.outerHTML;
  },

  writeIframe(content) {
    const iframe = document.createElement('iframe');
    const f = document.body.appendChild(iframe);
    const w = f.contentWindow || f.contentDocument;
    const doc = f.contentDocument || f.contentWindow.document;

    iframe.id = 'myIframe';
    iframe.style = 'position:absolute;width:0;height:0;top:-10px;left:-10px;';

    doc.open();
    doc.write(content);
    doc.close();
    this.toPrint(w);
    document.body.removeChild(iframe);
  },
  writeDocument(content) {
    const newWindow = window.open('_blank');
    newWindow.document.write(content);
    newWindow.document.close();
    this.toPrint(newWindow);
    setTimeout(() => {
      newWindow.close();
    }, 100);
  },
  toPrint(frameWindow) {
    try {
      setTimeout(() => {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 100);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = Print;
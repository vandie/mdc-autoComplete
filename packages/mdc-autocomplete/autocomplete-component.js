class autoComplete extends MDCComponent {
    set searchArray(arr) {
      this.foundation_.setSearchArray(arr)
    }

    set bestGuess(guess) {
        this.foundation_.setBestGuess(guess)
    }

    get searchArray() {
        return this.foundation_.getSearchArray()
    }

    get bestGuess() {
        return this.foundation_.mostLikely
    }
  
    getDefaultFoundation() {
      return new autoCompleteFoundation({
        getAttr: attr => this.root_.getAttribute(attr),
        setAttr: (attr, value) => this.root_.setAttribute(attr, value),
        getChild: (searchFor) => this.root_.querySelector(searchFor),
        setMostLikelySpan: textContent => { this.root_.querySelector('.mdc-autocomplete__span').innerHTML = textContent },
        setInputText: textContent => { this.root_.querySelector('input').value = textContent },
        registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
        deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
        blurInput: () => this.root_.querySelector('input').blur()
      })
    }
  }
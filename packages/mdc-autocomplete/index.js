/*
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {MDCComponent} from '@material/base'
import MDCautoCompleteFoundation from './foundation'
export {MDCautoCompleteFoundation}

class MDCAutoComplete extends MDCComponent {
    set searchArray(arr) {
      this.foundation_.setSearchArray(arr)
    }

    get searchArray() {
        return this.foundation_.getSearchArray()
    }

    get bestGuess() {
        return this.foundation_.mostLikely
    }

    static attachTo(root) {
        return new MDCautoComplete(root);
    }
  
    getDefaultFoundation() {
      return new MDCautoCompleteFoundation({
        getAttr: attr => this.root_.getAttribute(attr),
        setAttr: (attr, value) => this.root_.setAttribute(attr, value),
        getChild: (searchFor) => this.root_.querySelector(searchFor),
        setMostLikelySpan: textContent => { this.root_.querySelector(MDCautoCompleteFoundation.strings.AUTOCOMPLETESPAN_SELECTOR).innerHTML = textContent },
        setInputText: textContent => { this.root_.querySelector('input').value = textContent },
        registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
        deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
        blurInput: () => this.root_.querySelector('input').blur(),
        ev: (e) => { this.root_.dispatchEvent(e) }
      })
    }
  }
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
import {strings} from './constants';
import MDCFoundation from '@material/base/foundation';

class MDCautoCompleteFoundation extends MDCFoundation {

    static get strings() {
        return strings;
    }

    static get defaultAdapter() {
        return {
            getAttr: (/* attr: string */) => /* string */ '',
            setAttr: (/* attr: string, value: string */) => {},
            getChild : (/* searchFor: string */) => {},
            setMostLikelySpan: (/* textContent: string */) => {},
            setInputText: (/* text: string */) => {},
            registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
            deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
            blurInput: () => {},
            ev: (/* e: event */) => {}
        };
      }
    
    constructor(adapter) {
        super(Object.assign(MDCautoCompleteFoundation.defaultAdapter, adapter))
        this.typeHandler1_ = (event) => { this.autoComplete() }
        this.typeHandler2_ = (event) => { this.handle(event) }
        this.typeHandler3_ = (event) => { this.selectComplete() }
        this.forceChange = this.adapter_.getAttr('data-mdc-autocomplete-forceComplete')
        this.input = this.adapter_.getChild('input')
        this.autospan = this.adapter_.getChild(strings.AUTOCOMPLETESPAN_SELECTOR)
        this.SearchArray = []
        this.searchAttribute = this.adapter_.getAttr('data-mdc-autocomplete-searchAttribute') ? this.adapter_.getAttr('data-mdc-searchAttribute') : false
        this.mostLikely = {}
        this.mostLikely[this.searchAttribute] = ""
        this.init()
    }

    init() {
        this.adapter_.registerInteractionHandler('keyup', this.typeHandler1_)
        this.adapter_.registerInteractionHandler('keydown', this.typeHandler2_)
        if(this.forceChange)
            this.adapter_.registerInteractionHandler('change', this.typeHandler3_)
    }

    setSearchArray(arr) {
        this.SearchArray = arr
    }

    getSearchArray() {
        return this.SearchArray
    }

    destroy() {
        this.adapter_.deregisterInteractionHandler('keyup')
        this.adapter_.deregisterInteractionHandler('keydown')
        this.adapter_.deregisterInteractionHandler('change')
    }

    search(arr,searchTerm,variable) {
        if(variable && typeof(variable) === 'string' && typeof(arr[0][variable]) === 'string') // if the array contains objects, searchers for the correct variable
            return arr.find(o => o[variable].toLowerCase().startsWith( searchTerm.toLowerCase() ) )
        else if(typeof(arr[0]) === 'string') //if the array contains strings search them
            return arr.find(o => o.toLowerCase().startsWith( searchTerm.toLowerCase() ) )
        else //else throw an error
            throw new Error('Can only search strings...')
    }

    autoComplete() {
        let lastMostLikely = this.mostLikely
        if(this.input.value.length == 0){
            this.setBestGuess("")
        }else{
            let res = this.search(this.SearchArray,this.input.value,this.searchAttribute)
            this.setBestGuess(res)
        }
        this.adapter_.setMostLikelySpan(
            this.input.value + this.getGuessText().substring(this.input.value.length)
        )
        if(lastMostLikely != this.mostLikely){
            var newBestGuess = new CustomEvent("MDCAutocomplete:newBestGuess", { detail: { guess: this.mostLikely } })
            this.adapter_.ev(newBestGuess)
        }
    }

    getBestGuess() {
        return this.mostLikely
    }

    setBestGuess(guess = false) {
        if((this.searchAttribute == false && typeof(guess) === 'string' ) ||
        (guess[this.searchAttribute] && guess[this.searchAttribute].length > 0)){
            this.mostLikely = guess
        }else if(this.searchAttribute == false){
            this.mostLikely = ""
        }else{
            this.mostLikely = {}
            this.mostLikely[this.searchAttribute] = this.input.value
        }
    }

    getGuessText() {
        if(this.searchAttribute != false)
            return this.mostLikely[this.searchAttribute]
        else
            return this.mostLikely
    }

    selectComplete() {
        this.adapter_.setMostLikelySpan ( this.getGuessText()  )
        this.adapter_.setInputText ( this.getGuessText()  )
        this.adapter_.blurInput()
    }

    handle(event) {
        if (event.keyCode == 13)
            this.selectComplete()
        else
            this.autoComplete()
    }
}
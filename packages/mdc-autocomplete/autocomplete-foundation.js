class autoCompleteFoundation extends MDCFoundation {

    static get defaultAdapter() {
        return {
            getAttr: (/* attr: string */) => /* string */ '',
            setAttr: (/* attr: string, value: string */) => {},
            getChild : (/* searchFor: string */) => {},
            setMostLikelySpan: (/* textContent: string */) => {},
            setInputText: (/* text: string */) => {},
            registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
            deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
            blurInput: () => {}
        };
      }
    
    constructor(adapter) {
        super(Object.assign(autoCompleteFoundation.defaultAdapter, adapter))
        this.typeHandler1_ = (event) => { this.autoComplete() }
        this.typeHandler2_ = (event) => { this.handle(event) }
        this.typeHandler3_ = (event) => { this.selectComplete() }
        this.forceChange = this.adapter_.getAttr('ForceComplete')
        this.input = this.adapter_.getChild('input')
        this.autospan = this.adapter_.getChild('.mdc-autocomplete__span')
        this.SearchArray = []
        this.searchAttribute = this.adapter_.getAttr('searchAttribute') ? this.adapter_.getAttr('searchAttribute') : false
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
        this.adapter_.setMostLikelySpan( this.getGuessText() )
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
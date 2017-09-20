class autoCompletePrototype {
    
        constructor(root,searchArr) {
            this.root = root
            this.typeHandler1_ = (event) => { this.autoComplete() }
            this.typeHandler2_ = (event) => { this.handle(event) }
            this.typeHandler3_ = (event) => { this.selectComplete() }
            this.forceChange = this.root.getAttribute('ForceComplete')
            this.input = this.root.querySelector('input')
            this.autospan = this.root.querySelector('.mdc-autocomplete__span')
            this.SearchArray = searchArr
            this.searchAttribute = this.root.getAttribute('searchAttribute') ? this.root.getAttribute('searchAttribute') : false
            this.mostLikely = {}
            this.mostLikely[this.searchAttribute] = ""
            this.initialize()
        }
    
        initialize() {
            this.root.querySelector('input').addEventListener('keyup', this.typeHandler1_)
            this.root.querySelector('input').addEventListener('keydown', this.typeHandler2_)
            if(this.forceChange)
                this.root.querySelector('input').addEventListener('change', this.typeHandler3_)
        }
    
        destroy() {
            this.root.querySelector('input').removeEventListener('keyup')
            this.root.querySelector('input').removeEventListener('keydown')
            this.root.querySelector('input').removeEventListener('change')
        }
    
        search(arr,searchTerm,variable) {
            if(variable && typeof(variable) === 'string') // if the array contains objects, searchers for the correct variable
                return arr.find(o => o[variable].toLowerCase().startsWith( searchTerm.toLowerCase() ) )
            else if(typeof(arr[0]) === 'string') //if the array contains strings search them
                return arr.find(o => o.toLowerCase().startsWith( searchTerm.toLowerCase() ) )
            else //else throw an error
                throw new Error('Can only search strings...')
        }

        autoComplete() {
            let lastMostLikely = this.mostLikely
            if(this.input.value.length == 0){
                setBestGuess("")
            }else{
                let res = this.search(this.SearchArray,this.input.value,this.searchAttribute)
                setBestGuess(res)
            }
            this.autospan.innerHTML = getGuessText() 
        }

        getBestGuess() {
            return this.mostLikely
        }

        setBestGuess(guess) {
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

        getCurrentBestGuess() {
            return this.mostLikely
        }
    
        selectComplete() {
            this.input.value = this.mostLikely[this.searchAttribute]
            this.input.blur()
        }
    
        handle(event) {
            if (event.keyCode == 13)
                this.selectComplete()
            else
                this.autoComplete()
        }
    }
    
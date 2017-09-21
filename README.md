# AutoComplete Component

Follows the Material design spec as seen [here](https://material.io/guidelines/components/text-fields.html#text-fields-layout)

Designed to be 100% compatible with [MDC for Web](https://github.com/material-components/material-components-web)

[Component Egineering Outline](https://docs.google.com/document/d/19ZCzqEHSoqN7k47l6PwUXT7zH82gUbCSRFPOJo7DxBw/edit?usp=sharing)

## Example
![Test gif](https://github.com/vandie/mdc-autoComplete/raw/master/images/autocomplete.gif)

[Example usage](https://codepen.io/vandie/pen/jGbgvQ)

## Intallation
This respository was created because I needed it for my own projects and it was not yet in MDC. I am hoping that they will adopt it and as such I have not created any builds outside my own or released it to NPM so as to avoid confusion. To install you can go to the above codepen and copy the script above `//Install code above here` to your own script then build the scss alongside all other MDC scss. Sorry if this isn't as easy as you'd hope...

## Basic Usage
For basic usage put the autocomplete class in the textfield div and and add the autocomplete span as shown below.
```HTML
<div class="mdc-textfield mdc-autocomplete">
    <input type="text" id="my-textfield" class="mdc-textfield__input">
    <label class="mdc-textfield__label" for="my-textfield">Autocomplete Test</label>
    <span class='mdc-autocomplete__span'></span>
</div>
```

Next you need to initiate the component and requires you to set a search array.
```javascript
var arr = ['blue','red','green']//an array of strings
var x = MDCautoComplete.attachTo(document.querySelector('.mdc-autocomplete'))//init the autocomplete
x.searchArray = arr;// set the search array
```

Your autocomplete should now function.

## Better Usage
It's unlikely that you would just want string data in your auto complete. You may (for example) require an avatar to apear when a valid email has been typed in. This can be done using the `searchAttribute` attribute on the mdc-autocomplete div and a slight modification to your array. Example below.
```HTML
<div class="mdc-textfield mdc-autocomplete" searchAttribute='email'>
    <input type="text" id="my-textfield" class="mdc-textfield__input">
    <label class="mdc-textfield__label" for="my-textfield">Autocomplete Test</label>
    <span class='mdc-autocomplete__span'></span>
</div>
```
Then in your initiation of the component, do this instead.
```javascript
var arr = [{email:'eg1@eg.test',avatar:'blue.png'},{email:'eg2@eg.test',avatar:'red.png'},{email:'eg3@eg.test',avatar:'green.png'},{email:'eg4@eg.test',avatar:'yellow.png'}]//an array of objects

var ac = MDCAutoComplete.attachTo(document.querySelector('.mdc-autocomplete')) //init the autocomplete element

ac.searchArray = arr//set the search array for the autocomplete
```

You may also like to force the user to use any autocompleted option. This can be done by adding `ForceComplete=true` to the mdc-autocomplete element like so:

```HTML
<div class="mdc-textfield mdc-autocomplete" ForceComplete=true>
    <input type="text" id="my-textfield" class="mdc-textfield__input">
    <label class="mdc-textfield__label" for="my-textfield">Autocomplete Test</label>
    <span class='mdc-autocomplete__span'></span>
</div>
```

## Events
When an autocomplete changes it's current best guess, it will fire an event. This event called `newBestGuess` will contain a variable called `guess` inside the variable `detail`. If you wanted to get  the avatar from our previous example each time the best guess changed then the following code would do it.
```javascript
document.querySelector('.mdc-autocomplete').addEventListener("newBestGuess",function(e) {
  console.log(e.detail.guess.avatar) //log the avatar file name of the current best guess
})
```

## Theming
This component uses the hint color from your current theme. More info on theming can be found [here](https://material.io/components/web/catalog/theme/)

![Light Theme](https://github.com/vandie/mdc-autoComplete/raw/master/images/light.png)

![Dark Theme](https://github.com/vandie/mdc-autoComplete/raw/master/images/dark.png)
/*   Collection Pane
**
**  This pane allows collections of significant links to be viewed
*/
var UI = require('solid-ui')

module.exports = {
  icon: UI.icons.iconBase + 'noun_598334.svg',

  name: 'credit',

  label: function (subject) {
    var kb = UI.store

    if (!kb.anyStatementMatching(
        subject, UI.ns.rdf('type'),
        kb.sym('https://w3id.org/cc#Credit'))) {
      return null
    }

    return 'credit'
  },

  render: function (subject, myDocument) {
    var link = function (contents, uri) {
      if (!uri) return contents
      var a = myDocument.createElement('a')
      a.setAttribute('href', uri)
      a.appendChild(contents)
      a.addEventListener('click', UI.widgets.openHrefInOutlineMode, true)
      return a
    }

    var text = function (str) {
      return myDocument.createTextNode(str)
    }

    var textDiv = function (str) {
      var div = myDocument.createElement('div')
      var t = myDocument.createTextNode(str)
      div.appendChild(t)
      div.style = 'text-align : left'
      return div
    }

    function renderDOM (model) {
      containerDiv.style = 'width : 100%; max-width: 1310px; margin: 0 auto; overflow: hidden; padding: 5px; text-align: right;'

      if (model.timestamp) {
        var timestampDiv = textDiv('' + model.timestamp.value)
        timestampDiv.style['text-align'] = 'right'
        timestampDiv.style.color = 'gray'
        containerDiv.appendChild(timestampDiv)
      }
      if (model.source && model.destination) {
        var txDiv = textDiv('' + model.source.uri + ' ⇨ ' + model.destination.uri)
        containerDiv.appendChild(txDiv)
        txDiv.style['text-align'] = 'right'
      }
      if (model.amount) {
        var amountDiv = textDiv('' + model.amount.value + ' ' + model.currency.uri)
        amountDiv.style['text-align'] = 'right'
        amountDiv.style.color = 'gray'
        containerDiv.appendChild(amountDiv)
      }
      if (model.description) {
        var descriptionDiv = textDiv('' + model.description.value)
        descriptionDiv.style['text-align'] = 'right'
        descriptionDiv.style.color = 'gray'
        containerDiv.appendChild(descriptionDiv)
      }
      if (model.context) {
        var contextDiv = link(text(model.context.value), model.context.value)
        contextDiv.style['text-align'] = 'right'
        contextDiv.style.color = 'gray'
        containerDiv.appendChild(contextDiv)
      }
    }

    var kb = UI.store

    var source = kb.any(subject, $rdf.sym('https://w3id.org/cc#source'))
    var destination = kb.any(subject, $rdf.sym('https://w3id.org/cc#destination'))
    var amount = kb.any(subject, $rdf.sym('https://w3id.org/cc#amount'))
    var currency = kb.any(subject, $rdf.sym('https://w3id.org/cc#currency'))
    var timestamp = kb.any(subject, $rdf.sym('https://w3id.org/cc#timestamp'))
    var description = kb.any(subject, $rdf.sym('https://w3id.org/cc#description'))
    var context = kb.any(subject, $rdf.sym('https://w3id.org/cc#context'))

    var model = {
      'source': source,
      'destination': destination,
      'amount': amount,
      'currency': currency,
      'timestamp': timestamp,
      'description': description,
      'context': context
    }

    var containerDiv = myDocument.createElement('div')
    renderDOM(model)
    return containerDiv
  }
}

// ends

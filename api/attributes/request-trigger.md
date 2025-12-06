# `data-request-trigger`

When the `data-request` attribute is specified for an element, the element triggers an AJAX request when a user interacts with it. Depending on the type of element, the request is triggered on the following events:

Element | Event
------------- | -------------
**Forms** | when the form is submitted.
**Links, buttons** | when the element is clicked.
**Text, number, and password fields** | when the text is changed and only if the `data-track-input` attribute is presented.
**Dropdowns, checkboxes, radios** | when the element is selected.

`data-auto-submit` automatically triggers an AJAX request on elements that also have the `data-request` attribute. The request submits when the browser window is active using the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API). The optional attribute value can define the interval, in milliseconds, the framework waits before it sends the request.

`data-track-input` can be applied to a text, number, or password input field that also has the `data-request` attribute. When defined, the input field automatically sends an AJAX request when a user types something in the field. The optional attribute value can define the interval, in milliseconds, the framework waits before it sends the requests.

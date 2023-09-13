# Popstart

Popstart is a library for rapid JS front-end development. 
This is a brand-new project, CONTRIBUTIONS GREATLY APPRECIATED!

## What is Popstart™?

Popstart is an open sourced (MIT license) library for rapid Javascript front-end development.

There are no dependencies and no build process. It's simple and lightweight. There is no shadow DOM, no virtual DOM diffing, and function binding is optimized for larger applications.

Popstart offers a straightforward visual representation of exactly what events are tied to which objects and it's very fast, even with thousands of objects on-screen and off. It's optimized for SPA's, but works well with page-oriented applications as well.

Here's an example to send a completed form to the server via AJAX:

```javascript
<form submit=__.scrape,__.show,__.post,__.hide
    scrape-selector=".example .form"
    show-selector=".example .spinner"
    post-url=/api/example/form
    post-error=__.hide
    hide-selector=".example .spinner">
```


## How it Works

Popstart uses attributes inside of HTML to cause
changes to occur within the page, AJAX requests to be made, etc.

Each function listed such as `__.get()` will have its arguments automatically
read from the HTML tag and applied in order.

If the function returns a promise (like `__.get()`) then a failure in the
promise will stop the function chain and cause the error flow to be executed
instead. If a function does not return a promise, it will be wrapped in a
promise. All promises in a chain will be executed sequentially until a failure
occurs.

Most attributes would be in response to an event, such as `click=__.toggle`, but there are some special attributes. For example, `startup` causes the methods to be run after the page is loaded.


## Examples

### Example: Upon Startup (page load)

The following is a real example of a startup tag:

```javascript
<div class=hidden startup="
      # switches you to the main feed if you're logged in,
      __.get
      __.switch
      __.themeFromCookie
      # .. or redirects to the login page if you're not logged in"
    get-url=/api/logged-in
    get-error=__.redirect
    redirect-url=/login
    switch-on=.profile
    switch-off=.page
></div>
```

The `<div>` only exists to trigger the startup flow, which first
checks to see if the user is logged in (if /api/logged-in returns
a `200 OK` or `403 Forbidden`).

Upon success (2xx status code), all `.page` divs are hidden and then `.profile.page` is displayed.

If, instead, an error status is returned, then the `get-error=` attribute
calls `__.redirect(url)` with the URL equal to `/login`.

### Example: Replace a simple `<option>1</option>` with full range of numbers

As noted above, `startup` causes the methods to be run after the page is loaded.

After the fields are populated (with days from 1 to 31 and years from 2016 back to 1900), `__.cloneMe()` will cause the populated div to be copied
into any tags that look like `<div class=birthdate></div>`.

```javascript
<!-- birthdate form field -->
<div startup="__.incrHTML-1,__.incrHTML-2,__.cloneMe"
    cloneMe-to=.birthdate
    incrHTML-selector-1=.yearsource
    incrHTML-replaceValue-1=1900
    incrHTML-start-1=2016
    incrHTML-end-1=1900
    incrHTML-step-1=-1
    incrHTML-selector-2=.daysource
    incrHTML-replaceValue-2=1
    incrHTML-start-2=1
    incrHTML-end-2=31
    incrHTML-step-2=1>
    <div class="rel">
        <div class=mt0-5>
            <select class="rnd wauto iblock" name=month placeholder=Month>
                <option value=1>January</option>
                <option value=2>February</option>
                <option value=3>March</option>
                <option value=4>April</option>
                <option value=5>May</option>
                <option value=6>June</option>
                <option value=7>July</option>
                <option value=8>August</option>
                <option value=9>September</option>
                <option value=10>October</option>
                <option value=11>November</option>
                <option value=12>December</option>
            </select>
            <label class="select rnd" style="top:.7rem;font-size:.8rem">
                Confirm Birthdate (you must be at least 16 years old)</label>
            <select class="daysource rnd wauto iblock" name=day placeholder=Day>
                <option>1</option>
            </select>
            <select class="yearsource rnd wauto iblock" name=year placeholder=Year>
                <option>1900</option>
            </select>
        </div>
    </div>
</div>
<!-- end of birthdate -->
```

### Example: clone HTML to multiple locations within the page

As above, `startup` causes the methods to be run as soon as the page is loaded.
(This is SVG for the trademarked Popchat logo.)

```javascript
<!-- logo src -->
<div startup=__.cloneMe cloneMe-to=.logo>
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 34 34">
        <g transform="translate(-75.802 -30.189)" clip-rule="evenodd" shape-rendering="geometricPrecision">
            <path class=color d="m86.603 59.36 3.4797 3.2257v-2.9463c4.2925 0.38099 8.6103 0.71118 12.827 0.91437 0.91437 0 1.7526-0.40639 2.3875-1.0414 0.58419-0.58418 0.96517-1.397 1.0414-2.2859v-0.25399-20.726c0-0.35559-0.0508-0.71118-0.15239-1.0668-0.2032-0.63498-0.55879-1.2446-1.016-1.7017-0.55878-0.53338-1.27-0.86357-2.0573-0.86357-0.2286 0-0.50799 0.0254-0.76198 0.127l-20.726 6.1974c-0.81277 0.25399-1.6001 0.63498-2.1843 1.2192h-0.0254c-0.58418 0.58418-0.93977 1.3462-0.93977 2.2859v12.979c0 0.96517 0.38099 1.8287 1.016 2.4637 0.63498 0.63498 1.4986 1.0414 2.4383 1.0922 1.5494 0.127 3.1241 0.25399 4.6734 0.38099z" image-rendering="optimizeQuality"/>
            <path class=inner d="m88.46 44.161 3.2741-0.9748c1.4882-0.33348 2.0538 0.10261 2.0538 1.0005 0 1.3083 0 1.9496 0.02977 3.2579 0 0.84654-0.56553 1.5392-2.0538 1.6674-1.1311 0.10261-2.4407 0.07696-3.2741 0.02565v-2.4883c0-0.82089 0-1.6674-0.02977-2.4883zm12.055-2.0009c-0.0298-3.5914-2.6788-3.5144-7.084-2.3857l-9.2866 2.3601 0.05953 13.622 4.3159 0.23087c0-1.3083-0.02976-2.5909-0.02976-3.8992 1.1311 0.15392 2.9765 0.25653 4.5242 0.20522 5.0302-0.15392 7.5305-2.1805 7.5305-5.6693-0.0298-1.4879-0.0298-2.9757-0.0298-4.4636z" fill="#fff" fill-rule="evenodd" image-rendering="optimizeQuality" stroke-width=".027632"/>
        </g>
    </svg>
</div>
```

### Example: Send a completed form to the server via AJAX

```javascript
<form submit=__.scrape,__.show,__.post,__.hide
    scrape-selector=".example .form"
    show-selector=".example .spinner"
    post-url=/api/example/form
    post-error=__.hide
    hide-selector=".example .spinner">
```

### Example: Calculate Recaptcha Score and Send Form to Server

`__.switch(on, off)` applies '.hidden' to the `off` divs and
removes it from the `on` divs (in order to show them).

This requires the Recaptcha helper.

```javascript
<form
    submit=__.recaptcha,__.scrape,__.post,__.switch
    scrape-writedatapath=signup
    recaptcha-sitekey=abc-xyz_
    recaptcha-action=signup
    post-url=/api/signup
    post-readdatapath=signup
    switch-on=.signup-successful
    switch-off=.subpage>
```


### Example: Populate a form with the results of an AJAX query

Assuming `/api/profile` returns `{"name": "Art Vandelay"}`,
the `name` `<input>` field would have its value set to that:

```javascript
<div class="page profile-edit"
    shown=__.get,__.populate
    get-url=/api/profile
    populate-selector=".page.profile-edit">

<!-- Name -->
<div>
    <input class=rnd populate=name name=name placeholder="Profile Name">
    <label class=rnd>Profile Name</label>
</div>
```

No error handling is specified, so a default error handler will be
called if the `get` results in an error.

A `<form submit=...>` tag could be added to this as well, or a
non-form `<button click=...>` instead.


## Getting Started

Download `popstart.js`, `popstart-utils.js` (if desired), and any helpers you need (or just clone this repository) and just add to the end of your HTML:

```html
<script src=/js/popstart/popstart.js></script>
<script src=/js/popstart/popstart-utils.js></script>
<script src=/js/popstart/helpers/recaptcha.js></script>
```

## Contributing

Please submit a pull request to the main branch.

## LICENSE

Popstart is MIT licensed.

## FAQ:

#### Q. Where is this from?

A. Popstart draws inspiration from AlpineJS, HTMX, Angular, and even jQuery and Moo from back in the day; if this isn't what you're looking for, check out one of those or one of the heavier alternatives like Vue/React.

#### Q. Where's the router?

A. It would be easy to code as a helper, but there is no router right now. You may not need one if you use `startup=` effectively.

#### Q. I don't like these `click=dosomething` attributes in my pristine HTML!

A. You can preface them with `x-` or `data-`, like `x-click=` or `data-click=`

#### Q. Does this work with CSP?

A. Yes, it works great and is actually safer than regular `onClick=` because the named attributes have to be calling an existing function rather than arbitrary JS. (Expansion of this answer is welcome!)

#### Q. What events can I bind to?

A. They're listed at the top of `popstart.js`, but you can remove ones you don't care about or add new ones, even ones that don't actually exist:

	BoundEventNames:['click','change','input','focus','blur','keyup','submit','mouseover','mouseout'],



## Who wrote this?

Popstart is copyright Popchat® Inc., a new chat startup based in Texas USA. First publication was Sept. 13, 2023.

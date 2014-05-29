# jQuery Validate

jQuery Validate is a live input validation plugin.

### Supported Validation Types:
- Phone
- Numeric
- ABA Bank Routing
- Email Addresses
- Matching Other Inputs
- Passwords
- Required
- Date
- String
- Minimum Length
- Maximum Length

## Basic Usage

#### HTML
```html
<input type="text" id="first-name" />
```

#### JavaScript
```javascript
// Required Field
$('#first-name').validate( { required: true } );
```

By default, the plugin will add CSS classes to the validated input. You can
style these with CSS.

#### CSS
```css
.validate-success {
    border: 1px solid green;
}

.validate-error {
    border: 1px solid red;
}
```

## Options
| Type              | Parameter             |
| ---               | ---                   |
| Phone             | type: "phone"         |
| Email             | type: "email"         |
| Password          | type: "password"      |
| Numeric           | type: "number"        |
| Date              | type: "date"          |
| ABA Routing       | type: "ABA"           |
| Match             | match: "#other-input" |
| Required          | required: true        |
| Minimum Length    | minLength: 4          |
| Maximum Length    | maxLength: 8          |

## Callback

If you need to do something programmatically when the validation is done, onDone
will return the result as a boolean.

#### JavaScript
### onDone: function( result )
```javascript
// JavaScript anonymous callback function after each validation check (keyup).
$('first-name').validate( {
    required: true,
    onDone: function( result ){
        if( !result ){
            console.log("Cannot leave input blank.");
        } else {
            console.log("You typed: "+$(this).val()+".");
        }
    }
});
``` 
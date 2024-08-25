# Attributes

Attributes are parts of elements that can modify how they look or work.

Attributes are put in the `att: {}` section when creating an element after the `type` and `def`.

### Example

```yaml
{type: line, def: [[0,0],[1,5]], att: {strokeColor: "blue"}}
```

* changes the stroke color to blue

## anchor

Anchors an element to another element so that it is moved with the other element. Takes a string with a composed element.

## dash

Makes the line a dashed line. Takes a number as a parameter.

* 0 for a solid line
* 1 for a dotted line
* 2 for a line with small dashes
* 3 for a line with medium dashes
* 4 for a line with big dashes
* 5 for a line with alternating medium and big dashes and large gaps
* 6 for a line with alternating medium and big dashes and small gaps

## fillColor

Changes the color of the fill. Takes a string which can be a hex code or color name.

## fillOpacity

Changes the opacity of the fill. Takes a number between 0 and 1 with 0 being transparent and 1 being opaque.

## fixed

Changes whether an element can be moved or not. Takes a boolean true or false value.

## label

Creates a label that is attached to the element.

## name

Gives a name to the element and the name is displayed by the label. Takes a string.

## shadow

Gives elements a shadow. Takes a boolean true or false value.

## snapToGrid

Makes points move in increments of one. Takes a boolean true or false value.

## strokeColor

Changes the colors of strokes which are line on the element. Takes a string which can be a hex code or color name.

## strokeOpacity

Makes the stroke of an element transparent. Takes a number between 0 and 1 with 0 being fully transparent and 1 being opaque.

## strokeWidth

Changes the with of the stroke. Takes a number as a value.

## trace

Traces an element when moved meaning that a copy of the element to the background is made when it is moved. Takes a boolean true or false value.

## withLabel

Enables the label to be viewed. Takes a boolean true or false value.

## visible

Allows you to hide an element. Takes a boolean true or false value.

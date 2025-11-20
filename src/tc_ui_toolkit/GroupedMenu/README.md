# GroupedMenu

## Filters

Filtering is enabled by providing an array of configuration objects.
You can just as easily disable filtering by giving an empty array.

### Basic Filter

A filter configuration object in it's simplest form is shown below:

```js
const filters = [
  {
    label: "Bookmarks",
    key: "bookmarks",
    icon: <BookmarkIcon style={{ color: "#ffffff" }} />
  }
];
```

The above fields have the following characteristics:

- **label** - the title of the filter visible to the user
- **icon** - the icon of the filter visible to the user
- **key** - the key used for filtering. The menu will use this key to evaluate properties on menu items.

The sample filter above will match every menu item that contains a `bookmarks` property with a truthy value.

### Complex Filter

Filters may introduce dependencies or evaluate against different forms of data.
For these a more complex filter configuration object is required.
See the example below:

```js
const filters = [
  {
    label: "Selected",
    key: "selections",
    disables: ["no-selections"],
    icon: <CheckIcon style={{ color: "#ffffff" }} />
  },
  {
    label: "No selection",
    id: "no-selections", // the default id is the key
    key: "selections",
    value: false, // the default value is `true`
    disables: ["selections"], // the default is `[]`
    icon: <BlockIcon />
  }
];
```

All of the fields from Basic Filters still apply.
The additional fields have the following characteristics:

- **disables** - an array of filter `id`s that are disabled when this filter is active. This is useful when filtering against both forms of a boolean.
- **id** - uniquely identifies the filter. When not specified this will be filled in with the value of `key`. In this case we need to differentiate between the selected and not-selected filters since they both filter on the same key.
- **value** - the value expected when evaluating the `key` on the menu item. When not specified this defaults to `true`.

## Status Icons

The Menu receives an array of configuration objects that control how the status of menu items are displayed.
These may look similar in form to (but should not be confused with) filter configurations as described above.

```js
const statusIcons = [
  {
    key: "bookmarks",
    //  value: true <-- optional field
    icon: <BookmarkIcon style={{ color: "#ffffff" }} />
  }
];
```

The above fields have the following characteristics:

- **key** - the key used to look up the menu item's status.
- **value** - the exact key value to match against. When not specified this defaults to true.
- **icon** - the icon to display on matching menu items.

The sample status icon above will display a bookmark icon on every menu item that contains a property `bookmarks` with a truthy value.

## Generating Menu Data

A utility has been provided that will process a group index and it's associated data to produce properly formatted menu data.

This example will generate menu entries where each group's progress is calculated based on the truthy value of it's children's `selections` field:

```js
const menuEntries = generateMenuData(groupIndex, groupData, "selections");
```

### Internal Menu Item Pre-Processing

By default the generated menu data will include `title` and `itemId` fields on each of the menu items.
The `groupId` will also be copied from the contextId and placed in the root of the object.
This is all done because the menu does not know anything about the contextId or any specially structured data
from translationCore or the tool.

For example, internally the utility is doing this:
```js
const {bookId, chapter, verse} = item.contextId.reference;
const newItem = {
  ...item,
  groupId: item.contextId.groupId,
  itemId: `${bookId} ${chapter}:${verse}`,
  title: `${bookId} ${chapter}:${verse}`
}
```

### Custom Menu Item Pre-Processing

If you need to perform some custom processing on the menu items like localized titles, progress keys, or more granular itemId's
you can provide a callback as the last argument. This callback is executed _after_ the internal pre-processing described previously.

For example:
```js
const menuEntries = generateMenuData(
  groupIndex,
  groupData,
  "finished",
  item => {
    const {
      contextId: {
        reference: { bookId, chapter, verse }
      }
    } = item;
    return {
      ...item,
      title: `${translate(bookId)} ${chapter}:${verse}`,
      finished: Boolean(item.selections)
    };
  }
);
```

In the above example we are adding a `finished` field to the item and a localized title.
We do not need to add a groupId and itemId because those have already been 
automatically injected into the item. You may of course override these as necessary.

Here's an example of what `item` in the previous example may look like in the case of processing group data for the tW tool:

```js
const item = {
  "priority": 1,
  "comments": false,
  "reminders": false,
  "selections": [
    {
      "text": "Abraham",
      "occurrence": 1,
      "occurrences": 1
    }
  ],
  "verseEdits": false,
  "contextId": {
    "reference": {
      "bookId": "gal",
      "chapter": 3,
      "verse": 6
    },
    "tool": "translationWords",
    "groupId": "abraham",
    "quote": "á¼Î²ÏÎ±á½°Î¼",
    "strong": ["G00110"],
    "occurrence": 1
  },
  "invalidated": false,
  
  // these are automatically injected and may be overridden
  "groupId": "abraham",
  "itemId": "gal 6:3",
  "title": "gal 6:3"
}
```

#### Tooltips

The menu will automatically display tooltips if the text within a menu item overflows.
By default the tooltip will contain the item title.
However, you can provide a custom tooltip by adding a `tooltip` field while pre-processing menu items as described above.

### Calculating Group Progress

We previously alluded to the concept of calculating group progress.

Here's the sample code:

```js
const menuEntries = generateMenuData(groupIndex, groupData, "selections");
```

Here we have indicated that the `selections` field within each of the menu items
control the progress of it's group.
Simply put, if within a group, all of it's item's `selections` fields evaluate as truthy
the group's progress will be 100%. If half of the items evaluate as falsy the group's
progress will be 50%, etc.

Any field can be used for the progress calculation.
And if the field does not already exist you can inject it using a custom pre-processor.

## Controlling the Active Menu Item

In order to control which item in the menu is currently active you must generate an object
similar to how we generate data for the menu.

```js
const activeEntry = generateMenuItem(contextId, item => {
  // do stuff
});
```

If you are using a pre-processor for generating your menu data you will want to use the same
pre-processor when generating your active entry.
Once you have your active entry you can simply add it to the correct prop on the GroupedMenu.

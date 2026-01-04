# Graph Shortcode Documentation

This Hugo site includes a custom shortcode for creating terminal-styled graphs that match the hacker green aesthetic.

## Features

- **Server-side processing**: Data is processed when Hugo builds the site
- **Terminal styling**: Automatic green color scheme matching the site theme
- **Multiple chart types**: Line, bar, pie, doughnut, radar, and more
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Override colors and styling as needed

## Basic Usage

The shortcode supports two modes:
1. **Inline JSON data** - Embed data directly in your markdown
2. **CSV file data** - Load data from a CSV file in your page bundle

### CSV File Mode (Recommended)

Place your CSV file in the same directory as your blog post's `index.md`:

```markdown
{{< graph id="my-chart" type="line" title="My Data" height="500" csv="data.csv" labelColumn="Date" dataColumn="Value" dateFormat="2006-01" >}}
{{< /graph >}}
```

**CSV Parameters:**
- `csv` - Filename of the CSV in the page bundle (required for CSV mode)
- `labelColumn` - Column name for x-axis labels (default: "Month")
- `dataColumn` - Column name for y-axis data (default: "Questions")
- `dateFormat` - Go date format for parsing timestamps (default: "2006-01")
- `skipRows` - Number of rows to skip from the start (default: 0)
- `maxRows` - Maximum number of rows to display (default: 0 = all)

**Example CSV file** (`data.csv`):
```csv
Date,Value
2024-01,100
2024-02,150
2024-03,175
```

### Inline JSON Mode

### Line Chart

```markdown
{{< graph id="my-chart" type="line" title="My Data" height="400" >}}
{
  "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
  "datasets": [{
    "label": "Sales",
    "data": [12, 19, 3, 5, 2]
  }]
}
{{< /graph >}}
```

### Bar Chart

```markdown
{{< graph id="bar-example" type="bar" title="Monthly Revenue" height="350" >}}
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [{
    "label": "Revenue ($k)",
    "data": [65, 59, 80, 81]
  }]
}
{{< /graph >}}
```

### Multiple Datasets

```markdown
{{< graph id="multi-line" type="line" title="Comparison" height="400" >}}
{
  "labels": ["2020", "2021", "2022", "2023", "2024"],
  "datasets": [
    {
      "label": "Product A",
      "data": [30, 45, 60, 70, 85]
    },
    {
      "label": "Product B",
      "data": [20, 35, 55, 65, 75]
    }
  ]
}
{{< /graph >}}
```

### Pie Chart

```markdown
{{< graph id="pie-chart" type="pie" title="Market Share" height="400" >}}
{
  "labels": ["Chrome", "Firefox", "Safari", "Edge"],
  "datasets": [{
    "data": [65, 15, 12, 8]
  }]
}
{{< /graph >}}
```

## Parameters

### Common Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `id` | No | Auto-generated | Unique identifier for the chart |
| `type` | No | `line` | Chart type: `line`, `bar`, `pie`, `doughnut`, `radar`, `polarArea` |
| `title` | No | Empty | Chart title displayed above the graph |
| `height` | No | `400` | Height of the chart container in pixels |

### CSV Mode Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `csv` | Yes (for CSV mode) | - | Filename of CSV in page bundle |
| `labelColumn` | No | `"Month"` | CSV column name for labels (x-axis) |
| `dataColumn` | No | `"Questions"` | CSV column name for data (y-axis) |
| `dateFormat` | No | `"2006-01"` | Go date format string for parsing dates |
| `skipRows` | No | `0` | Number of data rows to skip |
| `maxRows` | No | `0` | Max rows to display (0 = all) |

## Data Format

The shortcode expects JSON data in Chart.js format. The basic structure is:

```json
{
  "labels": ["Label 1", "Label 2", "Label 3"],
  "datasets": [{
    "label": "Dataset Name",
    "data": [value1, value2, value3]
  }]
}
```

### Advanced Data Options

You can override the automatic styling by providing Chart.js dataset properties:

```markdown
{{< graph id="custom-style" type="line" title="Custom Colors" >}}
{
  "labels": ["A", "B", "C"],
  "datasets": [{
    "label": "Custom",
    "data": [10, 20, 30],
    "borderColor": "rgb(255, 99, 132)",
    "backgroundColor": "rgba(255, 99, 132, 0.2)",
    "borderWidth": 3
  }]
}
{{< /graph >}}
```

## Color Scheme

The shortcode automatically applies terminal-style colors:

- **Primary**: `rgb(173, 255, 47)` (greenyellow)
- **Secondary**: `rgb(0, 255, 0)` (green)
- **Tertiary**: `rgb(0, 200, 0)` (darker green)
- **Grid**: `rgba(0, 255, 0, 0.2)`
- **Background**: `rgba(0, 255, 0, 0.1)`

Multiple datasets automatically cycle through these colors.

## CSS Classes

The graph container has the class `.graph-container` with the following variants:

- `.graph-container.full-width` - Full width graph (extends to edges)
- `.graph-container.compact` - Smaller padding and title

To use variants, wrap the shortcode in a div:

```html
<div class="graph-container compact">
{{< graph ... >}}
...
{{< /graph >}}
</div>
```

## Examples

### StackOverflow Decline

```markdown
{{< graph id="stackoverflow" type="line" title="Stack Overflow Activity" height="400" >}}
{
  "labels": ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  "datasets": [{
    "label": "Questions (thousands/month)",
    "data": [170, 180, 195, 175, 150, 120, 85],
    "fill": true
  }]
}
{{< /graph >}}
```

### Technology Adoption

```markdown
{{< graph id="tech-adoption" type="bar" title="Framework Adoption (%)" height="350" >}}
{
  "labels": ["React", "Vue", "Angular", "Svelte"],
  "datasets": [{
    "label": "2023",
    "data": [67, 45, 42, 18]
  }, {
    "label": "2024",
    "data": [71, 48, 38, 25]
  }]
}
{{< /graph >}}
```

### Response Time Distribution

```markdown
{{< graph id="response-times" type="doughnut" title="API Response Times" height="400" >}}
{
  "labels": ["< 100ms", "100-500ms", "500ms-1s", "> 1s"],
  "datasets": [{
    "data": [45, 35, 15, 5]
  }]
}
{{< /graph >}}
```

## Tips

1. **Keep IDs unique**: Each chart on a page needs a unique ID
2. **Data validation**: The shortcode validates JSON at build time - invalid JSON will cause build errors
3. **Responsive**: Charts are responsive by default, but fixed heights work better for consistency
4. **Performance**: Charts are rendered client-side but data is embedded at build time
5. **Testing**: Set `draft: false` and run `hugo server -D` to preview graphs

## Troubleshooting

**Graph not showing?**
- Check browser console for JavaScript errors
- Verify Chart.js is loaded (should be in page `<head>`)
- Ensure JSON data is valid
- Check that the ID is unique on the page

**Styling issues?**
- Graphs inherit the terminal theme automatically
- Custom colors can be added per dataset
- Container styling can be modified in `assets/sass/partials/_graphs.scss`

**Build errors?**
- Invalid JSON will cause Hugo build failures
- Check for unclosed braces or missing commas
- Ensure the shortcode tags are properly formatted

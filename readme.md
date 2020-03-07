# igoogle

> A command line tool to search and open saved bookmarks

## why

When I write code, the terminal window that is closest to me is always the closest. 
Whenever I need to query a document or a certain question, I need to open the browser and enter the content to query. 
If all this can be done through the CLI command That's a great thing to do, so referring to nrm's code, this simple tool was born.

## usage

```js
npm i igoogle

// global
npm i igoogle --g
```

## clis

![3jLEF0.png](https://s2.ax1x.com/2020/03/07/3jLEF0.png)

it's super simple to use. here are some practical scenarios.

### **for bookmark**

#### open one bookmark in optional browser, default is chrome.

```shell
igoogle open react
```

#### add one bookmark in your igoogle config file.

```shell
igoogle add react https://zh-hans.reactjs.org/
```

#### rename one bookmark to a new name.

```shell
igoogle rename react reactjs
```

#### delete one bookmark by bookmark name.

```shell
igoogle del reactjs
```

#### ls all the bookmark

```shell
igoogle ls
```

### **for google search**

#### search question via google.

```shell
igoogle s some question

igoogle search some question
```

## license

MIT
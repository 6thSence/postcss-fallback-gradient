# Fallback for your linear-gradient in IE

It's simple [postcss](https://github.com/postcss/postcss)-plugin creating fallback for line-gradient. Helpful for IE! [Can I use linear-gradient?](http://caniuse.com/#search=linear-gradient)

Use it! Enjoy it!

![wow](https://github.com/6thSence/assets-for-any-occasion/raw/master/200 (25).gif)

## Example 

### input.css 

``` css

.header__wrar {
    background: linear-gradient(top, #e2e2e2 0%, #dbdbdb 50%, #d1d1d1 51%, #fefefe 100%);
    }

.sidebar__wrap {
     background: linear-gradient(to top, rgb(30,87,153), rgb(255, 0,0), rgb(13,13,13));
     }

.footer__wrap {
    background: linear-gradient(left, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 50%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    }

```

### output.css 

``` css

.header__wrar {
    background: #d1d1d1;
    background: linear-gradient(top, #e2e2e2 0%, #dbdbdb 50%, #d1d1d1 51%, #fefefe 100%);
    }

.sidebar__wrap {
    background: #0d0d0d;
    background: linear-gradient(to top, rgb(30,87,153), rgb(255, 0,0), rgb(13,13,13));
    }

.footer__wrap {
    background: #f02f17;
    background: linear-gradient(left, rgba(248,80,50,1) 0%, rgba(241,111,92,1) 50%, rgba(246,41,12,1) 51%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%);
    }
    
```


## Getting started
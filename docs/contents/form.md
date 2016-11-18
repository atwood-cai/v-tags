# Form 表单

## Ajax 表单提交

表单不仅将 `FormItem` 封装到一个容器里面，它还实现了一些常用的表单逻辑，比如对于 `type` 为 `ajax` 类型的表单：

1. `@submit` 时进行输入校验
2. 校验通过后，将 `v-model` 传入的数据发送到由 `action` 指定的接口
3. 阻止用户重复提交
4. 判断返回结果的 `errno`，如果不为空则显示错误消息；否则向上发出 `success` 事件供使用者处理后续逻辑

下面是一个简单的例子，可以输入不同的值试试：

```vue
<v-form action="http://www.mocky.io/v2/582ea4f12600003e0465effa" v-model="item" @success="success">
  <v-form-item label="名称" required="true">
    <v-input v-model="item.title" placeholder="请输入2-10个字" :rules="rules.title"></v-input>
  </v-form-item>
  <v-form-item label="价格">
    <v-input v-model="item.price" placeholder="0.01-99999的数字" :rules="rules.price"></v-input>
  </v-form-item>
  <v-form-item>
      <button type="submit" class="btn btn-primary">提交</button>
  </v-form-item>
</v-form>

<script>
  export default {
    data: {
      item: {
        title: '',
        price: ''
      },
      rules: {
        title: {
          required: true,
          minlength: 2,
          maxlength: 10
        },
        price: {
          required: true,
          type: 'number',
          min: 0.01,
          max: 999999
        }
      }
    },
    methods: {
      success: function() {
        alert('提交成功啦')
      }
    }
  }
</script>
```

> 注意：Form 组件依赖 `Vue-Resouce` 发送 Ajax 请求。

## 普通表单

如果不想让组件进行 Ajax 提交，可以将表单的 `type` 设置为 `form`。比如下面例子中的表单采用的就是 HTML 默认的表单提交行为：

```vue
<v-form action="http://www.mocky.io/v2/582ea4f12600003e0465effa" type="form">
  <v-form-item label="名称" required="true">
    <v-input v-model="item.title" name="title" placeholder="请输入2-10个字" :rules="rules.title"></v-input>
  </v-form-item>
  <v-form-item label="价格">
    <v-input v-model="item.price" name="price" placeholder="0.01-99999的数字" :rules="rules.price"></v-input>
  </v-form-item>
  <v-form-item>
      <button type="submit" class="btn btn-primary">提交</button>
  </v-form-item>
</v-form>

<script>
  export default {
    data: {
      item: {
        title: '',
        price: ''
      },
      rules: {
        title: {
          required: true,
          minlength: 2,
          maxlength: 10
        },
        price: {
          required: true,
          type: 'number',
          min: 0.01,
          max: 999999
        }
      }
    }
  }
</script>
```

## 其它设置

### label 设置

`label-suffix` 是 `label` 后面添加的字符，默认为 `：`。如果你想去掉，可以将其设置为空。

```vue
<v-form label-suffix="">
  <v-form-item label="名称">
    <v-input v-model="item.title"></v-input>
  </v-form-item>
  <v-form-item label="价格">
    <v-input v-model="item.price"></v-input>
  </v-form-item>
</v-form>

<script>
  export default {
    data: {
      item: {
        title: '',
        price: ''
      }
    }
  }
</script>
```


{
  /**
   * sidebar
   */
  const toc = [
    {
      title: '使用说明',
      icon: 'book',
      subs: [
        {
          name: 'install',
          title: '安装'
        },
        {
          name: 'usage',
          title: '在项目中使用'
        }
      ]
    },
    {
      title: '表单元素',
      icon: 'list-alt',
      subs: [
        {
          name: 'input',
          title: 'Input'
        },
        {
          name: 'form-item',
          title: 'Form Item'
        },
        {
          name: 'form',
          title: 'Form'
        }
      ]
    },
    {
      title: '弹框',
      icon: 'window-maximize',
      subs: [
        {
          name: 'modal',
          title: 'Modal'
        }
      ]
    }
  ];
  Vue.component('sidebar', {
    template: `
      <section class="sidebar">
        <div v-for="item in list">
          <h3 class="hd">
            <i class="fa" :class="'fa-'+item.icon"></i>
            {{item.title}}
          </h3>
          <ul class="navigator">
            <li v-for="sub in item.subs">
              <router-link :to="'/'+sub.name" exact>{{sub.title}}</a>
            </li>
          </ul>
        </div>
      </section>
    `,
    data: function() {
      return {
        list: toc
      }
    }
  });
}
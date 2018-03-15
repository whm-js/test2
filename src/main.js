// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import "babel-polyfill"

Vue.config.productionTip = false

import {
  Container,
  Header,
  Aside,
  Footer,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Button,
  Table,
  TableColumn,
  Select,
  Option,
  Dialog,
  Row,
  Col,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  DatePicker,
  Tabs,
  TabPane,
  Message,
  Autocomplete,
  Steps,
  Step,
  MessageBox,
  Loading
} from 'element-ui';
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Loading)
// Vue.use(MessageBox)

Vue.$message = Vue.prototype.$message = MessageBox;
Vue.$alert = Vue.prototype.$alert = MessageBox.alert;
Vue.$confirm = Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

import Validatable from './components/validatable/';
import Input from './components/input/';
import Checkbox from './components/checkbox/';
import CheckboxGroup from './components/checkbox-group/';
import RadioGroup from './components/radio-group/';
import FormItem from './components/form-item/';
import Form from './components/form/';
import Modal from './components/modal/';
import Pagination from './components/pagination/';
import DatePicker from './components/date-picker/';
import DateRange from './components/date-range/';
import Tooltip from './components/tooltip/';
import Tag from './components/tag/';
import Table from './components/table/';
import {Select, Option, OptionGroup} from './components/select/'
import InputRange from './components/input-range/';
import {Suggest, SuggestItem} from './components/suggest';
//import {Dropdown, DropdownItem} from './components/dropdown/'
import Tree from './components/tree/';

const install = function(Vue) {
  Object.keys(this).map(key => this[key]).filter(
    C => C && typeof C.install === 'function' // Find all Vue plugins
  ).forEach(C => Vue.use(C));                 // and use them
};

export default {
  install,
  Validatable,
  Input,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  FormItem,
  Form,
  Modal,
  Pagination,
  DatePicker,
  DateRange,
  Tooltip,
  Tag,
  Table,
  Select,
  Option,
  OptionGroup,
  Suggest,
  SuggestItem,
  //Dropdown,
  //DropdownItem,
  InputRange,
  Tree
};

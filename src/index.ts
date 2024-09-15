// FIXME 万能转换器

import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

const Conversion = require('./utils/fnMap');

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

const fnMap = {
  1: 'BinaryToDecimal',
  2: 'BinaryToHexadecimal',
  3: 'DecimalToBinary',
  4: 'DecimalToHexadecimal',
  5: 'HexadecimalToBinary',
  6: 'HexadecimalToDecimal',
  7: 'RGBToHEX',
  8: 'HEXToRGB',
};

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        source: '选择待转换的字段',
        changeType: '预置转换类型',
        fun: '自定义转换函数',
        placeholder: '请填写具体的 JavaScript 转换函数',
        p1: '请选择文本或数字类型字段',
        0: '自定义转换函数',
        1: '二进制 -> 十进制',
        2: '二进制 -> 十六进制',
        3: '十进制 -> 二进制',
        4: '十进制 -> 十六进制',
        5: '十六进制 -> 二进制',
        6: '十六进制 -> 十进制',
        7: 'RGB -> HEX',
        8: 'HEX -> RGB',
        9: '当未选择『自定义转换函数』时，将使用所选的预置转换类型进行转换。',
        10: '更多详情，请参考',
        11: ' 使用文档',
      },
      'en-US': {
        source: 'Select the field to convert',
        changeType: 'Preset Conversion Type',
        fun: 'Custom Conversion Function',
        placeholder: 'Please provide the specific JavaScript conversion function.',
        p1: 'Please select a text or numeric field.',
        0: 'Custom conversion function',
        1: 'Binary -> Decimal',
        2: 'Binary -> Hexadecimal',
        3: 'Decimal -> Binary',
        4: 'Decimal -> Hexadecimal',
        5: 'Hexadecimal -> Binary',
        6: 'Hexadecimal -> Decimal',
        7: 'RGB -> HEX',
        8: 'HEX -> RGB',
        9: 'If the “Custom conversion function” option is not selected, the conversion will use the chosen preset conversion type.',
        10: 'For more details, please refer to',
        11: ' User documentation',
      },
      'ja-JP': {
        source: '変換するフィールドを選択',
        changeType: 'プリセット変換タイプ',
        fun: 'カスタム変換関数',
        placeholder: '具体的なJavaScript変換関数を記入してください。',
        p1: 'テキストまたは数値型のフィールドを選択してください。',
        0: 'カスタム変換関数',
        1: 'バイナリ -> 十進法',
        2: 'バイナリ -> 十六進法',
        3: '十進法 -> バイナリ',
        4: '十進法 -> 十六進法',
        5: '十六進法 -> バイナリ',
        6: '十六進法 -> 十進法',
        7: 'RGB -> HEX',
        8: 'HEX -> RGB',
        9: '「カスタム変換関数」が選択されていない場合は、選択したプリセット変換タイプを使用して変換を行います。',
        10: '詳細については、参照してください',
        11: ' 使用文書',
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'source',
      label: t('source'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number, FieldType.Text],
        placeholder: t('p1'),
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'changeType',
      label: t('changeType'),
      component: FieldComponent.SingleSelect,
      tooltips: [
        {
          type: 'text',
          content: t('9'),
        },
      ],
      props: {
        options: [
          { label: t('0'), value: 0 },
          { label: t('1'), value: 1 },
          { label: t('2'), value: 2 },
          { label: t('3'), value: 3 },
          { label: t('4'), value: 4 },
          { label: t('5'), value: 5 },
          { label: t('6'), value: 6 },
          { label: t('7'), value: 7 },
          { label: t('8'), value: 8 },
        ],
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'fun',
      label: t('fun'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('placeholder'),
      },
      tooltips: [
        {
          type: 'text',
          content: t('10'),
        },
        {
          type: 'link',
          text: t('11'),
          link: 'https://bcmcjimpjd.feishu.cn/base/I7AWbeSTLafqaJsTJ4BcmCF2nMg?table=ldxyob7oZYiCcGzh',
        },
      ],
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Text,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { changeType: any; source: { type: string; text: string }[] | number; fun: any }) => {
    const { source, fun, changeType } = formItemParams;

    // 数字类型 source 直接为值
    //  文本类型 source 为 [{ type: 'text , text '8'}]
    const sourceValue = Array.isArray(source) && source.length > 0 ? source[0].text : source;

    let targetValueFun: any = '';
    if (changeType.value === 0) {
      targetValueFun = new Function('return ' + fun)();
    }

    // 选了预置转换类型，则以预置转换类型为准
    let targetValue = '';

    if (changeType.value !== 0) {
      targetValue = Conversion[fnMap[changeType.value]](sourceValue);
    } else {
      if (typeof targetValueFun === 'function') {
        targetValue = targetValueFun(sourceValue);
      }
    }

    try {
      return {
        code: FieldCode.Success,
        data: String(targetValue),
      };
    } catch (e) {
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;

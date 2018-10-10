import Clock from './clock/clock'
import './style/animate.css'
import './style/clock.css'

new Clock({
  id:'clock',
  size:600,
  borderColor:'#9D8008',
  hourDotColor:'#644F02',
  hourDotShape:'square',// round || ''：圆 ，square:方
  minuteDotColor:'#91730E',
  hourPointerColor:'#544E02',
  minutePointerColor:'#CFC10D',
  secondPointerColor:'#890518',
  centerDotColor:'#6E076D',
  backgroundColor: '#0FB208',
  numberColor:'#95860A',
  transitions:'bounce',//bounce
  timezone:'',
  numberType:'Arabic',//'Rome' 'Arabic'
});

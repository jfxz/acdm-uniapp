<template>
	<view class="flightInfoClass">
		<!-- 最上面的航班信息 -->
		<view class="flight">
			<view class="head">
				<view style="width: 155rpx;">
					<image class="flightImage" src="../../static/plan_blue.png"></image>
				</view>
				<view class="flightNo">
					<view class="upText">
						<view class="left"></view>
						<view class="code" @tap="flightMsgStatus==='today'?init(linkFlight):initByDate(linkFlight)">{{formatFlight(flight)}}</view>
						<view class="right">
							<image src="../../static/input-cargo-blue.png" @tap="inpputNumber" v-if="inputShow()"></image>
						</view>
					</view>
					<view class="downText" @tap="flightMsgStatus==='today'?init(linkFlight):initByDate(linkFlight)">{{formatFlight(linkFlight)}}</view>
				</view>
				<view style="width: 155rpx;height:42rpx">
					<image class="followImage" :src="follow?'../../static/follow_red.png':'../../static/follow_gread.png'" @tap="followFlight"></image>
				</view>
			</view>
			<view class="body" :style="{height: isJw ? '208rpx' : '168rpx'}">
				<view class="flight-base-msg" :style="{height: isJw ? '208rpx' : '168rpx'}">
					<view class="flight-route">
						<view>{{formatFlightRoute(flight)}}</view>
					</view>
					<view class="TextAndNum">
						<view class="textClass">任务</view>
						<view class="numClass">{{formatTask(flight)}}</view>
					</view>
					<view class="TextAndNum">
						<view class="textClass">机型</view>
						<view class="numClass">{{flight.aircraftType||'--'}}</view>
					</view>
					<view class="TextAndNum">
						<view class="textClass">机位</view>
						<view class="numClass">{{flight.stand||'--'}}</view>
					</view>
					<view class="TextAndNum">
						<view class="textClass">机号</view>
						<view class="numClass">{{flight.registration||'--'}}</view>
					</view>
          <!-- v-if="isJw" -->
          <view class="aircraftTypeDetail" v-if="isJw">
            <view class="TextAndNum">
            	<view class="textClass">子机型</view>
            	<view class="numClass" style="font-size: 28rpx;">{{flight.aircraftTypeDetail||'--'}}</view>
            </view>
            <view class="TextAndNum">
            	<view class="textClass">发动机型号</view>
            	<view class="numClass">{{flight.engine||'--'}}</view>
            </view>
            <view class="TextAndNum">
            	<view class="textClass">运营方</view>
            	<view :class="['numClass', {isNoMatch: match(flight)}]">{{flight.airlinesIcaoCode||'--'}}</view>
            </view>
          </view>
          
				</view>
				<view class="flightStatus" :style="{background: formatStatusColor(flight.flightStatus)}">
					<text style="padding: 0px 8rpx;">{{formatStatus('flightStatus', flight.flightStatus)}}</text>
				</view>
			</view>
		</view>
		<view class="jump-sign" v-if="serviceAuth === '1' || serviceAuth === '2'">
			<u-button type="warning" class="clear" @tap="jumpSign">服务单确认签署</u-button>
		</view>
		<view class="flight-all-message">
			<!-- 航班详情 -->
			<scroll-view scroll-y="true" class="scroll-Y" :style="{height:scrollH+'rpx'}">
				<!-- 航班详情 -->
				<view class="detail">
          <!-- 操作 -->
          <view class="flight-opt card" v-if="hideOperates||flightStandList.length>0">
            <view class="head">
              <text style="margin-left: 20rpx;color: #333333;">操作</text>
            </view>
            <view class="body">
              <view v-if="operatesShow" style="margin-top: 100rpx;text-align: center;;">
                <u-loading mode="flower" :show="operatesShow"></u-loading>
              </view>
              <!-- 航班托靠 -->
              <view class="row" v-for="(item,index) in flightStandList" :key="item.index">
                <view class="name">
                  <view>{{'飞机入位'}}</view>
                  <view>{{`(${item.standCode})`||'--'}}</view>
                </view>
                <view class="targetTime">
                  <text class="time">{{formatTime(item.estOccupiedBegin)}}</text>
                  <text class="textClass">目标</text>
                </view>
                <view class="finishTime">
                  <view class="time">{{formatTime(item.actOccupiedBegin)}}</view>
                  <view class="textClass">实际</view>
                </view>
                <view class="btns">
                  <button class="cu-btn sm btn" style="background: #0090ff;" :style="!item.finish?'background: #0090ff;':'background:#999999'"
                   :disabled="item.finish?true:false" @tap="submitOnboard('edit',index)">编辑</button>
                  <button class="cu-btn sm btn" style="background: #DD524D;" v-if="item.finish" @tap="submitOnboard('cancel',item)">撤销</button>
                  <button class="cu-btn sm btn" style="background: #09BB07;" v-else @tap="submitOnboard('finish',item)">完成</button>
                </view>
              </view>
              <view class="row" v-for="(item,index) in operates" :key="item.id">
                <view class="name">
                  <text>{{item.description}}</text>
                </view>
                <view class="targetTime">
                  <text class="time">{{formatTime(item.targetTime)}}</text>
                  <text class="textClass">目标</text>
                </view>
                <view class="finishTime">
                  <view class="time">{{formatTime(item.editTime)}}</view>
                  <view class="textClass">实际</view>
                </view>
                <view class="btns">
                  <view class="top-btn" v-if="item.description==='接电源'">
                    <image src="../../static/input-cargo-blue.png" @tap="touchModal(item)"></image>
                  </view>
                  <view class="bottom-btn">
                    <button class="cu-btn sm btn" :style="!item.finish?'background: #0090ff;':'background:#999999'" @tap="optCompleteCheck(item,index,'edit')"
                     :disabled="item.finish">编辑</button>
                    <button class="cu-btn sm btn" style="background: #DD524D;" v-if="item.finish" @tap="submitClean(item)">撤销</button>
                    <button class="cu-btn sm btn" @tap="optCompleteCheck(item,index,'finish')" style="background: #09BB07;"
                     v-else>完成</button>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
				<view class="">
					<view class="tabs" style="border-radius: 7rpx 7rpx 0 0;background: #fff;">
						<view class="buttonClass" @tap="changeTab('info')" :style="tab==='info'?'color:#00a0e9':'color:#000000'">详情</view>
						<view class="centerLine"></view>
						<view class="buttonClass" @tap="changeTab('befor')" :style="tab==='befor'?'color:#00a0e9':'color:#000000'">前序航班</view>
					</view>
					<!-- 详细 -->
					<view class="info card" v-if="tab==='info'">
						<view class="flightRoute">
							<text style="margin-left: 20rpx;">航线：{{formatFlightRoute(flight)}}</text>
						</view>
						<view class="dep">
							<view class="head">
								<view class="city">{{flight.originCn}}
									<image class="flightImage" src="../../static/plan_gread.png"></image>
								</view>
								<view class="flightImageWeather">
									<image src="../../static/mist.png" v-if="flight.direction === 'A'" @tap="handelWeather"></image>
								</view>
								<view class="date">{{formatTime(flight.opdate,'YYYY-MM-DD')}}</view>
<!-- 								<view class="flightImageWeather">
									<image src="../../static/mist.png" v-if="flight.direction === 'A'" @tap="handelWeather"></image>
								</view> -->
							</view>
							<!-- 天气信息 -->
							<view class="weather-content" v-if="showWeather&&flight.direction === 'A'">
								<u-loading mode="flower" v-if="weatherFlag"></u-loading>
								<view v-if="!weatherFlag" class="weather-part">
									<view class="part">
										<view class="icon-class">
											<image :src="mistData.inmSrc"></image>
										</view>
										<view class="content">{{mistData.value}}</view>
										<view class="type">
											<text>{{mistData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="dewPointData.inmSrc"></image>
										</view>
										<view class="content">{{dewPointData.value}}</view>
										<view class="type">
											<text>{{dewPointData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="cloudData.inmSrc"></image>
										</view>
										<view class="content">{{cloudData.value}}</view>
										<view class="type">
											<text>{{cloudData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="visibilityData.inmSrc"></image>
										</view>
										<view class="content">{{visibilityData.value}}</view>
										<view class="type">
											<text>{{visibilityData.name}}</text>
										</view>
									</view>
									<view class="part" style="width: 25%;">
										<view class="icon-class">
											<image :src="windData.inmSrc"></image>
										</view>
										<view class="content">{{windData.value}}</view>
										<view class="type">
											<text>{{windData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="pressureData.inmSrc"></image>
										</view>
										<view class="content">{{pressureData.value}}</view>
										<view class="type">
											<text>{{pressureData.name}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="body">
								<view class="TextAndNum">
									<view class="textClass">计划</view>
									<view class="numClass">{{formatTime(flight.scheduleDepTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">预计</view>
									<view class="numClass">{{formatTime(flight.estimateDepTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">实际</view>
									<view class="numClass">{{formatTime(flight.actualDepTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">航站楼</view>
									<view class="numClass" v-if="flightdirection">{{formateOther(flight.terminal)}}</view>
									<view class="numClass" v-if="!flightdirection">{{'--'}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">柜台</view>
									<view class="numClass" v-if="flightdirection">{{formatDetail(flightDetail, 'checkIn')}}</view>
									<view class="numClass" v-if="!flightdirection">{{'--'}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">登机口</view>
									<view class="numClass" v-if="flightdirection">{{formateOther(flight.gate)}}</view>
									<view class="numClass" v-if="!flightdirection">{{'--'}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">登机时间</view>
									<view class="numClass">{{formatDetail(flight.meta,'metaGate')}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">COBT</view>
									<view class="numClass">{{formatTime(flight.localAcobt)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">CTOT</view>
									<view class="numClass">{{formatTime(flight.localCtot)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">截关时间</view>
									<view class="numClass">{{formatTime(flight.cutOffTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">减载时间</view>
									<view class="numClass">{{formatTime(flight.loadLightenTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">异常原因</view>
									<view class="numClass">{{formatIrregular('irrCode',flight.irregulaarCode)}}</view>
								</view>
								<view class="TextAndNum">
									<!-- 成人/儿童/婴儿或值机 -->
									<view class="textClass">{{formatDetail(flightMailDetail,'man').title||'成人/儿童/婴儿'}}</view>
									<view class="numClass">
                    <text>{{formatDetail(flightMailDetail,'man').content||'--'}}</text>
                    <image  @tap="editPassenger" v-if="editPassengerShow()" src="@/static/input-cargo-blue.png" mode="aspectFit"></image>
                  </view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">行李/货物/邮件</view>
									<view class="numClass">{{formatDetail(flightMailDetail,'bag')}}</view>
								</view>
							</view>
						</view>
						<view class="arr">
							<view class="head">
								<view class="city">{{flight.destinationCn}}
									<image class="flightImage flightImage-transform" src="../../static/plan_gread.png"></image>
								</view>
								<view class="flightImageWeather">
									<image src="../../static/mist.png" v-if="flight.direction === 'D'" @tap="handelWeather"></image>
								</view>
								<view class="date">{{formatTime(flight.opdate,'YYYY-MM-DD')}}
								</view>
<!-- 								<view class="flightImageWeather">
									<image src="../../static/mist.png" v-if="flight.direction === 'D'" @tap="handelWeather"></image>
								</view> -->
							</view>
							<!-- 天气信息 -->
							<view class="weather-content" v-if="showWeather&&flight.direction === 'D'">
								<u-loading mode="flower" v-if="weatherFlag"></u-loading>
								<view v-if="!weatherFlag" class="weather-part">
									<view class="part">
										<view class="icon-class">
											<image :src="mistData.inmSrc"></image>
										</view>
										<view class="content">{{mistData.value}}</view>
										<view class="type">
											<text>{{mistData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="dewPointData.inmSrc"></image>
										</view>
										<view class="content">{{dewPointData.value}}</view>
										<view class="type">
											<text>{{dewPointData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="cloudData.inmSrc"></image>
										</view>
										<view class="content">{{cloudData.value}}</view>
										<view class="type">
											<text>{{cloudData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="visibilityData.inmSrc"></image>
										</view>
										<view class="content">{{visibilityData.value}}</view>
										<view class="type">
											<text>{{visibilityData.name}}</text>
										</view>
									</view>
									<view class="part" style="width: 25%;">
										<view class="icon-class">
											<image :src="windData.inmSrc"></image>
										</view>
										<view class="content">{{windData.value}}</view>
										<view class="type">
											<text>{{windData.name}}</text>
										</view>
									</view>
									<view class="part">
										<view class="icon-class">
											<image :src="pressureData.inmSrc"></image>
										</view>
										<view class="content">{{pressureData.value}}</view>
										<view class="type">
											<text>{{pressureData.name}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="body">
								<view class="TextAndNum">
									<view class="textClass">计划</view>
									<view class="numClass">{{formatTime(flight.scheduleArrTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">预计</view>
									<view class="numClass">{{formatTime(flight.estimateArrTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">实际</view>
									<view class="numClass">{{formatTime(flight.actualArrTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">航站楼</view>
									<view class="numClass" v-if="!flightdirection">{{formateOther(flight.terminal)}}</view>
									<view class="numClass" v-if="flightdirection">{{'--'}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">转盘</view>
									<view class="numClass" v-if="flightdirection">{{'--'}}</view>
									<view class="numClass" v-if="!flightdirection">{{formatDetail(flightDetail, 'carousel')}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">到达口</view>
									<view class="numClass" v-if="!flightdirection">{{formateOther(flight.gate)}}</view>
									<view class="numClass" v-if="flightdirection">{{'--'}}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 前序航班 -->
					<view class="befor card" v-else>
						<view class="item" v-for="item in beforFlight" :key="item.id">
							<view class="head">
								<view class="befor-flight">{{item.flight}}</view>
								<view class="status">{{item.flightstatus}}</view>
							</view>
							<view class="body">
								<view class="TextAndNum">
									<view class="textClass">计划起飞</view>
									<view class="numClass">{{formatTime(item.scheduleDepartTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">航线</view>
									<view class="numClass">{{item.originChineseName}}-{{item.destinationChineseName}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">计划到达</view>
									<view class="numClass">{{formatTime(item.scheduleArriveTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">实际起飞</view>
									<view class="numClass">{{formatTime(item.actualDepartTime)}}</view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">CTOT</view>
									<view class="numClass"></view>
								</view>
								<view class="TextAndNum">
									<view class="textClass">预计到达</view>
									<view class="numClass">{{formatTime(item.estimateArriveTime)}}</view>
								</view>
							</view>
						</view>
						<view class="item head" v-if="hideBeforAll">
							<view style="display: flex;justify-content: center;height:110rpx" @tap="showHideList">
								<view class="cuIcon-unfold" style="font-size: 55rpx;"></view>
							</view>
						</view>
					</view>
					<!-- 事件 -->
					<view class="flightEvent card">
						<view class="head">
							<view style="font-size: 35rpx;font-weight: bold;">航班事件</view>
							<image src="../../static/reflash.png" class="reflashImage" @tap="getFlightActive('remind')" v-if="flightMsgStatus==='today'"></image>
						</view>
						<view class="cu-timeline" v-for="(item,index) in flightActive" :key="item.id">
							<view class="cu-item events" :class="index%2?'cuIcon-round':'color:#00a0e9'" style="color:#00a0e9">
								<view class="eventName">{{item.description}}</view>
								<view class="timeAndDate">
									<view class="event-time">{{formatEventTime(item)}}</view>
									<view class="event-date">{{formatTime(item.scheduleEnd,'YYYY-MM-DD')}}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 限制信息 -->
					<view class="limit-message">
						<view class="head">
							<view style="width: 10rpx;background-color: #007AFF;height: 50rpx;margin: auto 20rpx;"></view>
							<view style="font-size: 35rpx;font-weight: bold;">当前限制信息</view>
						</view>
						<u-read-more show-height="600" :toggle="true" ref="uReadMore">
							<view v-for="(item,index) in limitData" :key="index" style="">
								<text style="padding-left: 10rpx;color: #333333;font-weight: bold;font-size: 32rpx;">{{item.title+' : '}}</text>
								<text style="font-size: 32rpx;color: #595959;">{{item.content}}</text>
							</view>
						</u-read-more>
					</view>
					<!-- 限制信息 -->
					<view class="contact-information card2">
						<view class="head">
							<view style="width: 10rpx;background-color: #007AFF;height: 50rpx;margin: auto 20rpx;"></view>
							<view style="font-size: 35rpx;font-weight: bold;">联系方式</view>
						</view>
						<u-read-more show-height="600" :toggle="true" ref="uReadMore">
							<view v-for="(value,key,index) in contactInfo" :key="index" style="">
								<text style="padding-left: 10rpx;font-size: 32rpx;color: #333333;font-weight: bold;">{{key+' : '}}</text>
								<text style="font-size: 32rpx;color: #0081FF;" @tap="callPhone(value)">{{value}}</text>
							</view>
						</u-read-more>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="cu-modal" :class="waringShow?'show':''">
			<view class="cu-dialog" style="width: 80%" @tap.stop="()=>{}">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="font-size: 40rpx;color: #000000;">警告</view>
				</view>
				<view class="bg-white">{{waringTip}}</view>
				<view class="bg-white">
					<view class="inputClass">
						<u-input v-model="waringRemark" type="textarea" :border="false" :auto-height="true" />
					</view>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action">
						<button class="cu-btn margin-left" style="background: #08B7FF;color:#FFFFFF;" @tap="waringShow=false">取消</button>
						<button class="cu-btn margin-left" style="background: #08B7FF;color:#FFFFFF" @tap="submitWaringRemark" :disabled="(!waringRemark)&&waringFinish">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="cleanWaringShow?'show':''">
			<view class="cu-dialog" style="width: 80%" @tap.stop="()=>{}">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="font-size: 40rpx;color: #000000;">警告</view>
				</view>
				<view class="bg-white">确定要撤销相关操作记录吗？</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action" style="margin-top: 20rpx;">
						<button class="cu-btn margin-left" style="background: #08B7FF;color:#FFFFFF" @tap="cleanWaringShow=false">取消</button>
						<button class="cu-btn margin-left" style="background: #08B7FF;color:#FFFFFF" @tap="submitCleanOperate">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="showBeforFlag?'show':''">
			<view class="cu-dialog" style="width: 80%" @tap.stop="()=>{}">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="font-size: 40rpx;color: #000000;">警告</view>
				</view>
				<view class="bg-white">前置节点未提交</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action" style="margin-top: 20rpx;">
						<button class="cu-btn margin-left" style="background: #08B7FF;color:#FFFFFF" @tap="showBeforFlag=false">确定</button>
					</view>
				</view>
			</view>
		</view>
    <input-reason-popup ref="inputReasonPopup" :selectReasonList="remoteDic" :callback="getGmsOperate" v-if="reasonPopupShow"></input-reason-popup>
		<u-picker mode="time" v-model="show" :params="params" @confirm="changeTime"></u-picker>
		<u-picker mode="time" v-model="timeSelectorShow" :params="params" @confirm="changeTimeStandIn"></u-picker>
	</view>
</template>

<script>
	import eventVue from '../../common/util/eventVue.js'
	import dayjs from "@/common/util/dayjs.min.js"
  import inputReasonPopup from "./components/input-reason-popup.vue"
	import * as flightApi from "@/api/flight/index.js"
  import {getRegistrationDetail, getAirlineByIata} from '@/api/dic/index.js'
	import {
		deepCopy
	} from "@/common/util/util.js"
	import {
		creatGroupByFlight
		// getUserAllList
	} from '@/api/imApi/admin.js'
	import {
		mapGetters
	} from 'vuex'
	import {
		flightWeather
	} from "@/pages/flight/flight-weather.vue"
	export default {
		data () {
			return {
				serviceAuth: false,
				flightObj: {},
				setDateTime: '',
				waringShow: false, //警告弹窗开关
        reasonPopupShow: false, //输入接电源原因弹窗
				waringTip: '',
				waringRemark: '', //警告说明
				waringFinish: true, //处置完毕警告内容限制
				cleanWaringShow: false, //撤销警告
				tab: 'info',
				flight: {}, // 当前显示航班
				linkFlight: {}, // link航班
				follow: false, // 关注状态,
				followInit: false, //关注初始状态
				userId: '',
				selectOptNode: null,
				selectOptIndex: 0,
				dic: {
					flightStatus: '',
					irrCode: '',
					color: []
				},
				flightActive: [], // 航班事件
				beforFlight: [], // 前序航班
				beforFlightAll: [], // 保存全部前序航班
				hideBeforAll: true, //隐藏前序航班
				defaultAirportCode: 'ZSAM', // 默认机场
				ALLFLIGHT: [], // 缓存中所有航班
				operates: [], // 节点操作
				hideOperates: 1,
				operatesShow: true,
				flightDetail: null, //flightDetail
				flightMailDetail: null, // 客货信息
				flightdirection: true, //true出港，false进港
				followId: '', // 若有关注，记录关注id
				weatherData: '', //天气信息
				limitData: [], //限制信息
				contactInfo: {}, //联系方式
				flightStandList: [], // 获取早班/航后入位记录
				flightStandIndex: 0, //获取入位记录顺序
				timeSelectorShow: false, //打开时间显示
				showBeforFlag: false,
				repeatClick: true,
				params: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false
				},
				show: false,
				flightMsgStatus: '',
				onShowFlag: true,
				searchDate: '',
				showWeather: false,
				weatherFlag: true, //天气图标
				//天气WEATHER|无  clouds风  wind云 pressure气压 visibility能见度 Temperature/Dew温度/露点
				mistData: {
					name: '天气',
					value: '0',
					inmSrc: '../../static/mist.png'
				},
				dewPointData: {
					name: '温度/露点',
					value: '0',
					inmSrc: '../../static/dewPoint.png'
				},
				cloudData: {
					name: '云',
					value: '0',
					inmSrc: '../../static/cloud.png'
				},
				visibilityData: {
					name: '能见度',
					value: '0',
					inmSrc: '../../static/visibility.png'
				},
				windData: {
					name: '风',
					value: '0',
					inmSrc: '../../static/wind.png'
				},
				pressureData: {
					name: '气压',
					value: '0',
					inmSrc: '../../static/pressure.png'
				}
			}
		},
		components: {
			flightWeather,
			inputReasonPopup
		},
		computed: {
			...mapGetters(['activityDiff', 'allUserMsg', 'remoteDic', 'user']),
			scrollH: function () {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let value = 310
				if (sys.platform === 'ios') {
					value = 310
				}
				if (sys.platform === 'android') {
					value = 230
				}
				let winHeight = parseInt(sys.windowHeight * winrate - value - 30)
				return winHeight
			},
      isJw () {
        let serviceAuth = uni.getStorageSync('serviceAuth')
        return serviceAuth ? serviceAuth === '2' : ''
      }
		},
		onLoad (val) {
      console.log('user', this.user)
			this.serviceAuth = uni.getStorageSync('serviceAuth')
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary');
			// #endif
			let obj = val || this.flightObj
			if (obj) {
				this.flightObj = obj
			}
			this.initBaseData()
			this.getDic()
			if (obj.hasOwnProperty('flightByDate') && obj.flightByDate) {
				console.log('qita')
				this.flightMsgStatus = 'otherday'
				this.initByDate(obj)
			} else {
				console.log('today')
				this.flightMsgStatus = 'today'
				this.init(obj)
			}
		},
		onReady () {},
		onShow () {
			getApp().globalData.imgSrc = ''
		},
		methods: {
      // 匹配运营方
      match (flight) {
        if (flight.airlinesIcaoCode) {
          return flight.icaocode !== flight.airlinesIcaoCode
        }
        return false
      },
      // 判断南航修改按钮
      editPassengerShow () {
        let isSouth = false
        let roles = this.user.userMessage.meta.roles
        let allUserRoles = this.$store.state.user.allUserRoles
        roles.forEach(role => {
          let match = allUserRoles.find(item => item.id === role)
          console.log('match', match)
          if (match && match.name === '南航') {
            isSouth = true
          }
        })
        if (this.flight.iataCarrier === 'CZ' && this.flight.direction === 'A' && isSouth) {
          return true
        } else {
          return false
        }
      },
      // 跳转客货邮
      editPassenger () {
        getApp().globalData.passengerFlightMsg = {...this.flightMailDetail, ...this.flight}
        uni.navigateTo({
          url: './passengerEnter'
        })
      },
			//初始化基础数据
			initBaseData () {
				if (this.$store.getters.user.userAirport) {
					this.defaultAirportCode = this.$store.getters.user.userAirport[0].icaocode // 默认机场
				} else {
					this.defaultAirportCode = 'ZSAM'
				}
				if (this.$store.getters.user.userId) {
					this.userId = this.$store.getters.user.userId
				}
			},
			// 拨打电话（联系方式）
			callPhone (phoneNum) {
				uni.makePhoneCall({
					phoneNumber: phoneNum
				})
			},
			// 跳转至签名
			jumpSign () {
				getApp().globalData.flightDetail = this.flight
        uni.navigateTo({
          url: '../e-service/index'
        })
			},
			// 当日航班初始化
			init (obj) {
				if (obj) {
					this.$loading('获取数据中')
					this.$store.dispatch('setFlightByflightId', obj.flightId).then(res => {
						this.ALLFLIGHT = this.$store.getters.flight.allFlight || []
						this.flight = res
            console.log('flight', this.flight)
            getAirlineByIata({iatacode: this.flight.iataCarrier}).then(queryRes => {
              if (queryRes.status && queryRes.data.content) {
                this.flight['icaocode'] = queryRes.data.content[0].icaocode
              }
            })
            getRegistrationDetail({registration: this.flight.registration}).then(result => {
              if (result.status) {
                this.flight = {...result.data, ...this.flight}
              }
            })
						uni.hideLoading()
						this.initData(obj)
					}).catch(err => {
						this.ALLFLIGHT = this.$store.getters.flight.allFlight || []
						this.flight = this.ALLFLIGHT.find(item => item.flightId === obj.flightId) || ''
						uni.hideLoading()
						this.initData(obj)
					})
				}
			},
			// 当日航班初始化数据操作
			initData (obj) {
				this.isDep(this.flight)
				//获取航班数据成功
				if (this.flight) {
					//设置限制信息
					this.setLmitData()
					//获取航班联系电话
					this.getFlightPhone()
					this.linkFlight = deepCopy(this.ALLFLIGHT.find(item => item.flightId === this.flight.linkedFlightId))
					this.$store.dispatch('getFollowList').then(key => {
						if (JSON.stringify(key) !== "{}") {
							let flag = key.find(item => item.flightId === obj.flightId)
							if (flag) {
								this.followId = flag.followId
								this.followInit = true
								this.follow = true
							} else {
								this.follow = false
								this.followId = ''
							}
						}
					})
					// 前序
					this.getBeforFlight()
					// 保障节点
					this.getGmsOperate()
					// 邮件信息
					this.getFlightOther()
					// 航班事件
					this.getFlightActive('noremind')
					//获取天气数据
					this.getWeathy()
				} else {
					this.operatesShow = false
				}
			},
			// 非当日航班信息初始化
			initByDate (obj) {
				if (obj) {
					if (this.onShowFlag) {
						this.onShowFlag = false
						this.$store.dispatch('getFlightByDate').then(res => {
							this.ALLFLIGHT = res
							this.flight = this.ALLFLIGHT.find(item => item.flightId === obj.flightId) || ''
							this.isDep(this.flight)
							if (this.flight) {
								this.linkFlight = deepCopy(this.ALLFLIGHT.find(item => item.flightId === this.flight.linkedFlightId))
								//设置限制信息
								this.setLmitData()
								//获取航班联系电话
								this.getFlightPhone()
								// 前序
								this.getBeforFlight()
								// 保障节点
								this.getGmsOperate()
								// 邮件信息
								this.getFlightOther()
								// 航班事件
								this.getFlightActive('noremind')
								//获取天气数据
								this.getWeathy()
							} else {
								this.operatesShow = false
							}
						}).catch(err => {
							uni.hideLoading()
						})
					} else {
						this.flight = this.ALLFLIGHT.find(item => item.flightId === obj.flightId) || ''
						this.isDep(this.flight)
						if (this.flight) {
							this.linkFlight = deepCopy(this.ALLFLIGHT.find(item => item.flightId === this.flight.linkedFlightId))
							//设置限制信息
							this.setLmitData()
							//获取航班联系电话
							this.getFlightPhone()
							// 前序
							this.getBeforFlight()
							// 保障节点
							this.getGmsOperate()
							// 邮件信息
							this.getFlightOther()
							// 航班事件
							this.getFlightActive('noremind')
							//获取天气数据 
							this.getWeathy()
						} else {
							this.operatesShow = false
						}
					}
				}
			},
			getDic () {
				this.dic.flightStatus = this.remoteDic.BASE_FLIGHT_STATUS
				this.dic.irrCode = this.remoteDic.BASE_IRREGULAR_CODE
				this.$store.dispatch('GetDic', ['FLIGHTSTATUSCOLOR']).then(res => {
					this.dic.color = res['FLIGHTSTATUSCOLOR']
				})
			},
			//获取天气数据
			getWeathy () {
				let date = new Date(new Date().toLocaleDateString()).getTime()
				let code = this.flight.direction === 'A' ? this.flight.origin : this.flight.destination
				flightApi.getFlightWeather({
					contentType: 'Metar',
					dataSource: 'variflight',
					flightCode: code,
					timeStamp: date
				}).then(res => {
					if (res.status && res.data) {
						this.weatherData = JSON.parse(res.data.parsingMessage)
						this.mistData.value = this.weatherData.WEATHER || '无'
						this.dewPointData.value = this.weatherData['Temperature/Dew'] + '°C ' || 0
						this.cloudData.value = this.weatherData['CLOUDS'] || '无'
						this.visibilityData.value = this.weatherData.VISIBILITY || 0
						this.windData.value = this.weatherData.wind || 0
						this.pressureData.value = this.weatherData.pressure || 0
						this.weatherFlag = false
						console.log(res, '天气信息')
					} else {
						this.weatherFlag = false
					}
				}).catch(() => {
					this.weatherFlag = false
				})
			},
			//设置限制信息 
			setLmitData () {
				if (this.flight && this.flight.ctrlContent) {
					let arr = []
					let data = deepCopy(this.flight.ctrlContent)
					let param = []
					// 判断是否有多条数据
					if (data.indexOf("#") != -1) {
						data = data.split("#")
						data.forEach(res => {
							if (res.indexOf("：") != -1) {
								param = res.split("：")
							}
							if (res.indexOf(":") != -1) {
								param = res.split(":")
							}
							if (param[0]) {
								arr.push({
									'title': param[0],
									'content': param[1]
								})
							}
						})
					} else {
						if (data.indexOf("：") != -1) {
							param = data.split("：")
						}
						if (data.indexOf(":") != -1) {
							param = data.split(":")
						}
						if (param[0]) {
							arr.push({
								'title': param[0],
								'content': param[1]
							})
						}
					}
					this.limitData = arr
				} else {
					this.limitData = []
				}
			},
			//获取航班联系方式
			getFlightPhone () {
				if (this.flight && this.flight.id) {
					flightApi.getFlightPhone({
						id: this.flight.id
					}).then(res => {
						this.contactInfo = res.data
						console.log('联系电话', res)
					})
				}
			},
			//天气图标点击
			handelWeather () {
				this.showWeather = !this.showWeather
			},
			//根据航司代理角色显示疫情人数录入/且为进港
			inputShow () {
				if (this.flight && this.flight.direction && this.allUserMsg.user.roleAgent) {
					return this.flight.direction === 'A' && this.allUserMsg.user.roleAgent.some(res => res === this.flight.generalagent)
				} else {
					return false
				}
			},
			//疫情人数录入
			inpputNumber () {
				let param = JSON.stringify(this.flight)
				uni.navigateTo({
					url: `./epidemic-input-number?flight=${param}`
				})
			},
			// 关注航班
			followFlight () {
				if (this.flightMsgStatus === 'otherday') {
					this.$message('非当日航班无法关注')
				} else if (this.repeatClick) {
					this.repeatClick = !this.repeatClick
					this.$loading('关注中...')
					if (!this.follow) {
						// 关注
						flightApi.postFollowFlight({
							flightid: this.flight.id,
							userid: this.userId
						}).then(res => {
							if (res.status) {
								this.$store.dispatch('setFollowList')
								this.$message('已关注')
								uni.hideLoading()
								this.creatGroup()
								// 更新通讯录
								// let userId = uni.getStorageSync('user_id')
								// getUserAllList(userId).then(res => {
								// 	console.log('更新通讯录getUserALLlist', res)
								// 	const data = res.data
								// 	this.$store.dispatch('setFriendsInfo', data.friendList)
								// 	// this.$store.dispatch('setFriendsTree', data.friendTree)
								// 	// 群组
								// 	this.$store.dispatch('setChannelInfo', data.channelList)
								// 	this.$store.dispatch('setSubscribeInfo', data.subscriptionList)
								// 	this.$store.dispatch('setActiveList', {
								// 		activeFriendList: data.activeFriendList,
								// 		activePublicChannelList: data.activePublicChannelList,
								// 		activeSubscriptionInfo: data.activeSubscriptionList
								// 	})
								// })
								this.follow = true
								this.repeatClick = !this.repeatClick
								if (this.followInit !== this.follow) {
									uni.setStorageSync('local_key', 'refresh');
								}
							} else {
								uni.hideLoading()
								this.repeatClick = !this.repeatClick
								this.$message('关注失败')
							}
						}).catch(err => {
							uni.hideLoading()
							this.$message('关注失败')
							this.repeatClick = !this.repeatClick
						})
					} else {
						this.$loading('取消关注中...')
						if (this.followId === '') {
							this.$store.dispatch('getFollowList').then(res => {
								let flag = res.find(item => item.flightId === this.flight.flightId)
								if (flag) {
									this.followId = flag.followId
								}
								// 取消关注
								flightApi.deleteFollowFlight(this.followId).then(res => {
									if (res.status) {
										this.$store.dispatch('setFollowList')
										setTimeout(() => {
											uni.hideLoading()
											this.$message('取消关注')
										}, 500)
										this.followId = ''
										this.repeatClick = !this.repeatClick
										this.follow = false
										if (this.followInit !== this.follow) {
											uni.setStorageSync('local_key', 'refresh');
										}
									} else {
										uni.hideLoading()
										this.$message('取消失败')
										this.repeatClick = !this.repeatClick
									}
								}).catch(err => {
									uni.hideLoading()
									this.$message('取消失败')
									this.repeatClick = !this.repeatClick
								})
							})
						} else {
							// 取消关注
							flightApi.deleteFollowFlight(this.followId).then(res => {
								if (res.status) {
									this.$store.dispatch('setFollowList')
									setTimeout(() => {
										uni.hideLoading()
										this.$message('取消关注')
									}, 500)
									this.followId = ''
									this.repeatClick = !this.repeatClick
									this.follow = false
									if (this.followInit !== this.follow) {
										uni.setStorageSync('local_key', 'refresh');
									}
								} else {
									uni.hideLoading()
									this.$message('取消失败')
									this.repeatClick = !this.repeatClick
								}
							}).catch(err => {
								uni.hideLoading()
								this.$message('取消失败')
								this.repeatClick = !this.repeatClick
							})
						}
					}
				}
			},
			// 获取航班事件
			getFlightActive (param) {
				let arrId = ''
				let depId = ''
				if (this.flight.direction === 'A') {
					arrId = this.flight.id
					if (this.linkFlight) {
						depId = this.linkFlight.id
					}
				} else {
					depId = this.flight.id
					if (this.linkFlight) {
						arrId = this.linkFlight.id
					}
				}
				flightApi.getFlightActive({
					arrFlightId: arrId,
					depFlightId: depId
				}).then(res => {
					if (res.status) {
						res.data.sort((a, b) => {
							let aSortTime = 0
							let bSortTime = 0
							if (a.actualEnd) {
								aSortTime = a.actualEnd
							} else if (a.estimateEnd) {
								aSortTime = a.estimateEnd
							} else if (a.scheduleEnd) {
								aSortTime = a.scheduleEnd
							}
							if (b.actualEnd) {
								bSortTime = b.actualEnd
							} else if (b.estimateEnd) {
								bSortTime = b.estimateEnd
							} else if (b.scheduleEnd) {
								bSortTime = b.scheduleEnd
							}
							return aSortTime - bSortTime
						})
						this.flightActive = res.data
						console.log(this.flightActive.length, '航班事件')
						if (param === 'remind') {
							uni.showToast({
								title: '航班事件更新成功',
								duration: 1000,
								icon: 'none'
							});
						}
					}
				})
			},
			// 获取航班其他信息
			getFlightOther () {
				flightApi.getFlightDetail({
					airportCode: this.defaultAirportCode,
					flightId: this.flight.id
				}).then(res => {
					if (res.status) {
						this.flightDetail = res.data
					} else {
						this.flightDetail = ''
					}
				}).catch(err => {
					this.flightDetail = ''
				})
				flightApi.getMailDetail({
					airportCode: this.defaultAirportCode,
					flightId: this.flight.flightId,
					opdate: this.flight.opdate,
					segmentId: this.flight.segmentId
				}).then(res => {
					if (res.status) {
						this.flightMailDetail = res.data
					} else {
						this.flightMailDetail = ''
					}
				}).catch(err => {
					this.flightMailDetail = ''
				})
			},
			// 获取前序航班
			getBeforFlight () {
				flightApi.getBeforFlightList({
					registration: this.flight.registration,
					timeStamp: this.flight.opdate
				}).then((res) => {
					if (res.status) {
						this.beforFlightAll = res.data
						this.beforFlight = []
						console.log(res.data.length, '前序航班')
						if (this.beforFlightAll.length > 2) {
							this.hideBeforAll = true
							for (let i = 0; i < 2; i++) {
								this.beforFlight.push(this.beforFlightAll[i])
							}
						} else {
							this.showHideList()
						}

					}
				})
			},
			// 获取节点
			getGmsOperate () {
				let arrId = ''
				let depId = ''
				if (this.flight.direction === 'A') {
					arrId = this.flight.id
					if (this.linkFlight) {
						depId = this.linkFlight.id
					}
				} else {
					depId = this.flight.id
					if (this.linkFlight) {
						arrId = this.linkFlight.id
					}
				}
				flightApi.getGmsOperate({
					airportCode: this.defaultAirportCode,
					arrId: arrId,
					depId: depId
				}).then(res => {
					if (res.status) {
						console.log(res.data.length, '节点数据')
						this.operatesShow = false
						res.data.forEach(item => {
							let target = null
							// 取目标时间
							if (item.displayTimeType === '1') {	
								target = item.deadlineEnd
							} else {
								if (item.estimateEnd) {
									target = item.estimateEnd
								} else {
									target = item.scheduleEnd
								}
							}
							item.targetTime = target
							item.finish = deepCopy(item.actualEnd) ? true : false
							item.editTime = deepCopy(item.actualEnd) ? item.actualEnd : null
						})
						this.operates = res.data
						this.hideOperates = res.data.length
						this.operatesShow = false
						this.getFlightStandInList()
					} else {
						this.operatesShow = false
						this.getFlightStandInList()
					}
				}).catch(err => {
					this.operatesShow = false
					this.getFlightStandInList()
				})
			},
			//获取早班/航后入位记录
			getFlightStandInList () {
				let param = ''
				if (!this.flight.linkedFlightId) {
					if (this.flight.direction === 'A') {
						param = 'arrFlightId=' + this.flight.id
					}
					if (this.flight.direction === 'D') {
						param = 'depFlightId=' + this.flight.id
					}
					flightApi.getFlightStandInRecord(param).then(res => {
						if (res.status && res.data) {
							res.data.forEach(item => {
								item.finish = item.actOccupiedBegin ? true : false
							})
							this.flightStandList = res.data
						} else {
							this.flightStandList = []
						}
					})
				}
			},
			//早班/航后飞机入位操作
			submitOnboard (type, item) {
				if (this.flightMsgStatus === 'otherday') {
					this.$message('非当日航班无法进行节点操作')
				} else {
					if (type == 'finish') {
						flightApi.setFlightStandIn({
							allocationId: item.id,
							date: item.actOccupiedBegin || new Date().getTime()
						}).then(res => {
							if (res.status) {
								this.getFlightStandInList()
							} else {
								this.$message(res.message)
							}
						})
					}
					if (type == 'cancel') {
						flightApi.setFlightStandIn({
							allocationId: item.id,
							date: null
						}).then(res => {
							if (res.status) {
								this.getFlightStandInList()
							} else {
								this.$message(res.message)
							}
						})
					}
					if (type == 'edit') {
						this.timeSelectorShow = true
						this.flightStandIndex = item //获取选中记录
					}
				}
			},
			//节点编辑/完成增加节点操作
			optCompleteCheck (item, index, type) {
				if (this.flightMsgStatus === 'otherday') {
					this.$message('非当日航班无法进行节点操作')
				} else {
					let linkId = ''
					let param = ''
					if (this.linkFlight && this.linkFlight.id) {
						linkId = this.linkFlight.id
					}
					if (this.flight.direction === 'A') {
						param = 'arrFlightId=' + this.flight.id + '&' + 'depFlightId=' + linkId + '&' + 'activityId=' +
							item.id
					}
					if (this.flight.direction === 'D') {
						param = 'depFlightId=' + this.flight.id + '&' + 'arrFlightId=' + linkId + '&' + 'activityId=' +
							item.id
					}
					flightApi.flightactivityCheck(param).then(res => {
						let unCompleteTip = '' //0前置节点未完成前置校验 1前置节点未完成信息
						if (res.status && res.data) {
							if (res.data.unCompletePreCheckLabels.length > 0) {
								unCompleteTip = res.data.unCompletePreCheckLabels.join(',') + '节点未完成,无法进行节点操作'
							}
							if (unCompleteTip) { //判断是否能操作节点
								this.$message(unCompleteTip)
							} else {
								this.isEditOrSumOpt(item, index, type)
							}
						} else {
							this.isEditOrSumOpt(item, index, type)
						}
					}).catch(err => {
						this.isEditOrSumOpt(item, index, type)
					})
				}
			},
			//判断是编辑节点或者完成节点
			isEditOrSumOpt (item, index, type) {
				if (type === 'edit') { //进行编辑操作
					this.editOpt(item, index)
				} else { //完成节点
					this.submitOpt(item, index)
				}

			},
			// 编辑时间
			editOpt (item, index) {
				this.selectOptNode = item
				if (item.editTime) {
					this.setDateTime = dayjs(item.editTime).format('HH:mm')
				} else if (item.actualEnd) {
					this.setDateTime = dayjs(item.actualEnd).format('HH:mm')
				} else {
					this.setDateTime = dayjs(new Date().getTime()).format('HH:mm')
				}
				this.show = true
			},
			// 节点提交按钮
			submitOpt (item, index) {
        this.waringFinish = true
        this.waringRemark = ''
        this.selectOptNode = item
        let ignoreTimeDiff = [ //不用偏移时间校验的节点
          '健康码查验',
          '首车发车',
          '末车发车',
          '接电源',
          '撤电源',
          '接空调',
          '撤空调',
        ]
        let time = new Date().getTime()
        if (item.editTime) {
          time = item.editTime
        }
        //操作处置完毕必须填写理由
        if (item.description === '处置完毕') {
          this.waringTip = '请输入处置情况'
          this.waringShow = true
          this.waringFinish = false
          //下面节点提交，不用进行时间偏移校验
        } else if (ignoreTimeDiff.some(key => key === item.description)) {
          this.submitOperate(time, item.id, '')
        } else {
          if (time - item.targetTime > this.activityDiff * 60 * 1000 || item.targetTime - time > this.activityDiff * 60 *
            1000) {
            this.waringTip = `时间偏离大于${this.activityDiff}分钟是否需要提交`
            this.waringShow = true
          } else {
            this.submitOperate(time, item.id, '')
          }
        }
      },
      // 节点提交
      submitOperate (time, id, remark) {
        let data = {
          actualBegin: time,
          actualEnd: time,
          activityId: id
        }
        if (remark) {
          data.remark = remark
        }
        flightApi.postGmsOperate(data).then(res => {
          if (res.status) {
            this.$message('提交成功')
            this.getGmsOperate()
          } else {
            this.$message(res.message)
          }
        })
      },
			// 时间提交
			changeTime (val) {
				let nowDay = new Date()
				let year = nowDay.getFullYear()
				let month = nowDay.getMonth() + 1
				let day = nowDay.getDate()
				let time = new Date(year + '/' + month + '/' + day + ' ' + val.hour + ':' + val.minute + ':00').getTime()
				this.$set(this.selectOptNode, 'editTime', time)
				// 输出{hour: "13", minute: "57", result: "13:57"}
				console.log(val)
			},
			//托靠时间获取
			changeTimeStandIn (val) {
				let nowDay = new Date()
				let year = nowDay.getFullYear()
				let month = nowDay.getMonth() + 1
				let day = nowDay.getDate()
				let time = new Date(year + '/' + month + '/' + day + ' ' + val.hour + ':' + val.minute + ':00').getTime()
				this.flightStandList[this.flightStandIndex].actOccupiedBegin = time
			},
			// 节点提交
			submitOperate (time, id, remark) {
				let data = {
					actualBegin: time,
					actualEnd: time,
					activityId: id
				}
				let index = this.selectOptIndex
				let showBeforFlag = false
				if (remark) {
					data.remark = remark
				}
				// 判断前置节点
				if (index > 0) {
					showBeforFlag = this.operates[index - 1].finish == null
				}
				flightApi.postGmsOperate(data).then(res => {
					if (res.status) {
						this.$message('提交成功')
						this.showBeforFlag = showBeforFlag
						this.getGmsOperate()
					} else {
						this.$message(res.message)
					}
				})
			},
			// 完成的警告提交
			submitWaringRemark () {
				this.waringShow = false
				let time = new Date().getTime()
				if (this.selectOptNode.editTime) {
					time = this.selectOptNode.editTime
				}
				this.submitOperate(time, this.selectOptNode.id, this.waringRemark)
			},
			// 点击节点撤销
			submitClean (item) {
				if (this.flightMsgStatus === 'otherday') {
					this.$message('非当日航班无法进行节点操作')
				} else {
					this.selectOptNode = item
					this.cleanWaringShow = true
				}
			},
			// 撤销节点操作
			submitCleanOperate () {
				this.cleanWaringShow = false
				flightApi.postGmsOperate({
					activityId: this.selectOptNode.id
				}).then(res => {
					if (res.status) {
						this.$message('撤销成功')
						this.getGmsOperate()
					}
				})
			},
      // 接电源弹窗显示
      touchModal (item) {
        this.reasonPopupShow = true
        this.$nextTick(()=>{
          this.$refs['inputReasonPopup'].init(item)
        })
      },
			// 切换详情和前序航班
			changeTab (val) {
				this.tab = val
			},
			// 显示隐藏的前序航班
			showHideList () {
				this.hideBeforAll = false
				this.beforFlight = this.beforFlightAll
			},
			// 判断是否是出港，返回true false
			isDep (flight) {
				if (flight) {
					this.flightdirection = flight.direction === 'D'
				}
			},
			// 关注时加入群聊
			creatGroup () {
				let arrFlight = null
				let depFlight = null
				let flight = this.flight
				let linkFlight = this.linkFlight
				if (flight.direction === 'D') {
					depFlight = flight
					arrFlight = linkFlight ? linkFlight : {}
				} else {
					arrFlight = flight
					depFlight = linkFlight ? linkFlight : {}
				}
				// creatGroupByFlight({
				// 	airportCode: flight.airportCode,
				// 	arrCarrier: arrFlight.iataCarrier,
				// 	arrFlight: arrFlight.flight,
				// 	depCarrier: depFlight.iataCarrier,
				// 	depFlight: depFlight.flight,
				// 	opdate: flight.opdate
				// }).then(res => {})
			},
			// 转换时间戳为key的类型
			formatTime (val, key) {
				if (!key) {
					key = 'HH:mm'
				}
				let time = null
				if (val) {
					time = dayjs(val).format(key)
				}
				return time || '--:--'
			},
			// 航班事件取三合一时间
			formatEventTime (item) {
				let time = '--'
				if (item.actualBegin) {
					time = item.actualBegin
				} else if (item.estimateBegin) {
					time = item.estimateBegin
				} else if (item.scheduleBegin) {
					time = item.scheduleBegin
				}
				if (time != '--') {
					time = dayjs(time).format('HH:mm')
				}
				return time
			},
			// 通用字典转换,key传入字典中的字段
			format (Key, val) {
				if (this.dic[Key]) {
					let res = ''
					res = this.dic[Key].find(item => val === item.value)
					if (res) {
						res = res.label
					}
					return res || '--'
				} else {
					return '--'
				}
			},
			formateOther (val) {
				if (val) {
					return val
				} else {
					return '--'
				}
			},
			formatTask (val) {
				if (this.remoteDic.BASE_FLIGHT_TASK) {
					let res = ''
					let task = ''
					if (val && val.flightTask) {
						task = val.flightTask
					}
					res = this.remoteDic.BASE_FLIGHT_TASK.find(item => item.flightTaskCode === task)
					if (res) {
						res = res.abbr2w
					}
					return res || '--'
				} else {
					return '--'
				}
			},
			formatIrregular (Key, val) {
				if (this.dic[Key]) {
					let res = ''
					res = this.dic[Key].find(item => val === item.irregularCode)
					if (res) {
						res = res.description
					}
					return res || '--'
				} else {
					return '--'
				}
			},
			// 航班状态颜色
			formatStatusColor (val) {
				if (this.dic.color) {
					let color = null
					color = this.dic.color[this.formatStatus('flightStatus', val)]
					if (color) {
						return color
					} else {
						return '#d7dfec'
					}
				}
			},
			// 通用字典转换,key传入字典中的字段
			formatStatus (Key, val) {
				if (this.dic[Key]) {
					let res = ''
					res = this.dic[Key].find(item => val === item.statusCode)
					if (res) {
						res = res.description
					}
					return res || '--'
				} else {
					return '--'
				}
			},
			formatFlight (flight) {
				if (flight) {
					if (flight.iataCarrier && flight.flight) {
						return flight.iataCarrier + flight.flight
					} else {
						return '----'
					}
				} else {
					return '----'
				}
			},
			formatFlightRoute (flight) {
				if (flight) {
					if (flight.flightRouteCn) {
						return flight.flightRouteCn
					} else if (flight.originCn && flight.destinationCn) {
						return flight.originCn + ' - ' + flight.destinationCn
					} else if (flight.originCn && !flight.destinationCn) {
						return flight.originCn + ' - ' + '--'
					} else if (!flight.originCn && flight.destinationCn) {
						return '--' + ' - ' + flight.originCn
					} else {
						return '----'
					}
				} else {
					return '----'
				}
			},
			formatDetail (val, key) {
				if (val && key === 'bag') {
					if (val.flightLoad) {
						if (val.flightLoad.baggage || val.flightLoad.cargo || val.flightLoad.post) {
							let bag = ''
							let cargo = ''
							let post = ''
							bag = val.flightLoad.baggage || 0
							cargo = val.flightLoad.cargo || 0
							post = val.flightLoad.post || 0
							return bag + '/' + cargo + '/' + post
						} else {
							return '--'
						}
					} else {
						return '--'
					}
				}
				if (val && key === 'carousel' && val.carouselAllocations) {
					if (val.carouselAllocations.carouselCode) {
						return val.carouselAllocations.carouselCode
					} else {
						return '--'
					}
				}
				if (val && key === 'man') {
					// 进港
					let adult = 0
					let child = 0
					let infant = 0
					let alreadyCheckInNumber = 0
					let totalCheckInNumber = 0
					let returnData = {
						'title': '成人/儿童/婴儿',
						'content': '--'
					}
					//判断数据是否存在，且成人/儿童/婴儿有个一不为0
					// alreadyCheckInNumber已经值机 alreadyBoardingNumber已经登机 totalCheckInNumber已售票人数
					if (val.flightLoad && JSON.stringify(val.flightLoad) !== '{}' && (val.flightLoad.adult !== 0 || val.flightLoad.child !==
							0 || val.flightLoad.infant !== 0)) {
						adult = val.flightLoad.adult
						child = val.flightLoad.child
						infant = val.flightLoad.infant
						returnData.content = adult + '/' + child + '/' + infant
						return returnData
					} else if (val.alreadyCheckInNumber !== 0 || val.totalCheckInNumber !== 0) {
						returnData.title = '值机'
						returnData.content = val.alreadyCheckInNumber + '/' + val.totalCheckInNumber
						return returnData
					} else {
						return returnData
					}
				}
				if (val && key === 'metaGate') {
					if (val.gateDetail) {
						if (val.gateDetail.actualopen) {
							return dayjs(val.gateDetail.actualopen).format('HH:mm')
						} else if (val.gateDetail.estimateopen) {
							return dayjs(val.gateDetail.estimateopen).format('HH:mm')
						} else if (val.gateDetail.scheduleopen) {
							return dayjs(val.gateDetail.scheduleopen).format('HH:mm')
						} else {
							return '--:--'
						}
					} else {
						return '--:--'
					}
				}
				if (val && key === 'checkIn') {
					if (val.ckCounterTimetables && val.ckCounterTimetables.checkincounter) {
						return val.ckCounterTimetables.checkincounter
					} else {
						return '--'
					}
				}
				return '--'
			}
		}
	}
</script>

<style lang="scss">
	.flightInfoClass {
		height: 100vh;
		padding: 0px 10rpx;
		overflow: hidden;

		.jump-sign {
			margin-top: 20rpx;
		}

		.card {
			background: #FFFFFF;
			border-radius: 12rpx;
		}

		.inputClass {
			border: solid 1px #08B7FF;
			margin: 0 50rpx;
			border-radius: 3px;
			height: 100rpx;
		}

		.flight {
			width: 100%;
			margin-top: 10rpx;

			.flightImage {
				width: 75rpx;
				height: 71rpx;
				margin-left: 70rpx;
			}

			.followImage {
				position: absolute;
				width: 42rpx;
				height: 42rpx;
				right: 37rpx;
			}

			.head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				background-color: #FFFFFF;
				border-bottom: dashed 1px #e5e5e5;
				height: 140rpx;
				align-items: center;
				border-radius: 14rpx 14rpx 0 0;

				.flightNo {
					width: 440rpx;
					text-align: center;

					.upText {
						margin-top: 20rpx;
						height: 60rpx;
						line-height: 60rpx;
						font-size: 58rpx;
						font-weight: bold;
						display: flex;
						justify-content: space-around;

						.left {
							width: 10%;
						}

						.code {
							width: 80%;
						}

						.right {
							width: 10%;

							image {
								width: 38rpx;
								height: 52rpx;
								position: relative;
								top: 15rpx;
							}
						}
					}

					.downText {
						margin-top: 10rpx;
						height: 30rpx;
						line-height: 30rpx;
						font-size: 28rpx;
						color: #666666;
						font-weight: bold;
					}
				}
			}

			.body {
				display: flex;
				flex-direction: row;
				height: 168rpx;
				align-items: center;
				justify-content: space-between;
				background: #FFFFFF;
				border-radius: 0 0 14rpx 14rpx;
        .aircraftTypeDetail {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          // min-width: 65%;
        }
				.flight-base-msg {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					min-width: 65%;
					height: 168rpx;

					.flight-route {
						width: 100%;
						height: 50rpx;
						line-height: 50rpx;
						margin-left: 28rpx;
						font-weight: bold;
					}
				}

				.taskStatus {
					margin-right: 37rpx;
					line-height: 74rpx;
					color: #ffffff;
					border-radius: 7rpx;
					min-width: 180rpx;
					height: 74rpx;
					text-align: center;
					font-size: 34rpx;
					$status: ('1': #1890ff,
						'2': #767c96,
						'3': #389e0d,
						'null': #d48806);

					@each $key,
					$value in $status {
						&.taskStatus-#{$key} {
							background: $value;
						}
					}
				}

				.flightStatus {
					// margin-left: 160rpx;
					// margin-top: 12rpx;
					margin-right: 37rpx;
					line-height: 74rpx;
					color: #ffffff;
					border-radius: 7rpx;
					min-width: 150rpx;
					height: 74rpx;
					text-align: center;
					font-size: 35rpx;
				}
			}

			.TextAndNum {
				display: flex;
				flex-direction: column;
				text-align: center;
				// margin-left: 20rpx;
				width: 25%;

				.textClass {
					margin-top: 8rpx;
					color: #999999;
					font-size: 24rpx;
					height: 22rpx;
					line-height: 22rpx;
					font-weight: bold;
					// width: 25%;
				}

				.numClass {
					margin-top: 5rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 32rpx;
					font-weight: bold;
          &.isNoMatch {
            color: red;
          }
					// width: 25%;
				}
			}
		}

		.flight-all-message {
			margin-top: 10rpx;

			.scroll-Y {
				// height: calc(100vh - 310rpx);
				width: 100%;

				.tabs {
					margin-top: 10rpx;
					display: flex;
					flex-direction: row;

					.buttonClass {
						margin: 0px 20rpx;
						padding: 15rpx 5rpx;
						font-size: 35rpx;
					}

					.centerLine {
						width: 1px;
						margin-top: 5rpx;
						height: 78rpx;
						border-right: solid 2px #e5e5e5;
					}
				}

				.info {
					min-height: 250rpx;

					.flightImage-transform {
						transform: rotate(180deg);
					}

					.flightImage {
						width: 30rpx;
						height: 25rpx;
						margin-left: 10rpx;
						position: relative;
						top: -10rpx;
						left: 10rpx;
					}

					.flightImageWeather {
						width: 15%;
						height: 100%;
						text-align: right;
						// padding-right: 37rpx;
						padding-top: 10rpx;

						image {
							width: 40rpx;
							height: 40rpx;
						}
					}

					.city {
						margin-left: 35rpx;
						width: 50%;
						font-size: 35rpx;
						font-weight: bold;
					}

					.date {
						width: 30%;
						text-align: right;
						font-size: 28rpx;
						color: #999999;
						line-height: 80rpx;
						height: 80rpx;
						padding-right: 30rpx;
					}

					.head {
						display: flex;
						flex-direction: row;
						border-bottom: solid 1px #E5E5E5;
						height: 80rpx;
						line-height: 80rpx;
					}

					.flightRoute {
						border-radius: 0;
						background: #09BB07;
						color: #FFFFFF;
						padding: 10rpx 0;
						height: 60rpx;
						font-size: 28rpx;
					}

					.body {
						display: flex;
						flex-flow: row wrap;
						padding-bottom: 20rpx;

						.TextAndNum {
							flex: 0 0 33%;
							display: flex;
							flex-direction: column;
							text-align: center;
							padding: 10rpx 0;

							.textClass {
								margin-top: 15rpx;
								color: #999999;
								font-size: 24rpx;
								height: 22rpx;
								line-height: 22rpx;
							}

							.numClass {
								height: 40rpx;
								line-height: 40rpx;
								font-size: 35rpx;
								margin-top: 20rpx;
                image {
                  height: 30rpx;
                  width: 30rpx;
                }
							}
						}
					}
				}

				.befor {
					min-height: 250rpx;
					border-top: solid 1px #E5E5E5;

					.item {
						border-bottom: solid 1px #E5E5E5;

						.head {
							display: flex;
							flex-direction: row;
							padding: 10rpx 0;
							background: #09BB07;
							color: #FFFFFF;
							height: 60rpx;
							font-size: 30rpx;

							.befor-flight {
								margin: auto 0;
								margin-left: 20rpx;
								width: 550rpx;
							}

							.status {
								color: #999999;
							}
						}

						.body {
							display: flex;
							flex-flow: row wrap;
							padding: 20rpx 0;

							.TextAndNum {
								flex: 0 0 33%;
								display: flex;
								flex-direction: column;
								text-align: center;
								padding-bottom: 20rpx;

								.textClass {
									margin-top: 12rpx;
									color: #999999;
									font-size: 24rpx;
									height: 22rpx;
									line-height: 22rpx;
								}

								.numClass {
									margin-top: 20rpx;
									height: 40rpx;
									line-height: 40rpx;
									padding: 5rpx 0;
									font-size: 35rpx;
								}
							}
						}
					}
				}

				.flight-opt {
					min-height: 300rpx;
					margin-top: 10rpx;

					.head {
						border-bottom: solid 2rpx #E5E5E5;
						padding: 10rpx 0;
						font-size: 35rpx;
						font-weight: bold;
					}

					.body {
						.row {
							display: flex;
							justify-content: space-between;
							padding: 10rpx 0;
							align-items: center;
							height: 160rpx;
							width: 100%;
							border-bottom: solid 2rpx #e5e5e5;

							.name {
								min-width: 150rpx;
								margin-top: 10rpx;
								text-align: center;
								font-size: 31rpx;
							}

							.targetTime {
								min-width: 130rpx;
								display: flex;
								flex-direction: row;
								margin-top: 10rpx;
								text-align: center;
								color: #4CD964;
							}

							.finishTime {
								min-width: 130rpx;
								display: flex;
								flex-direction: row;
								text-align: center;
								margin-top: 10rpx;
								margin-left: 15rpx;
								color: #333333;
							}

							.btns {
								height: 100%;
                min-width: 250rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                .top-btn {
                  width: 100%;
                  height: 40%;
                  font-size: 35rpx;
                  margin: auto;
                  text-align: center;

                  image {
                    height: 40rpx;
                    width: 35rpx;
                  }
                }

                .bottom-btn {
                  width: 100%;
                  height: 60%;

                  .btn {
                    margin-left: 10rpx;
                    color: #FFFFFF;
                    font-size: 24rpx;
                    border-radius: 7rpx;
                    width: 110rpx;
                    height: 75rpx;
                  }
                }
              }

							.time {
								font-size: 31rpx;
								font-weight: bold;
								font-family: STHeiti;
							}

							.textClass {
								margin-top: -5rpx;
								margin-left: -4rpx;
								font-size: 24rpx;
								font-weight: bold;
								font-family: STHeiti;
							}
						}
					}
				}

				.flightEvent {
					margin-top: 10rpx;
					min-height: 300rpx;
					padding-bottom: 50rpx;

					.head {
						display: flex;
						flex-direction: row;
						margin-left: 20rpx;
						color: #333333;
						margin-bottom: 10rpx;
						justify-content: space-between;
						margin-top: 10rpx;
						align-items: center;
						height: 100rpx;

						.reflashImage {
							width: 50rpx;
							height: 50rpx;
							margin-right: 37rpx;
							// margin: 10rpx 10rpx;
						}
					}

					.cu-timeline {
						height: 120rpx;
						.cu-item {
							height: 120rpx;
						}

						.events {
							height: 120rpx;
							display: flex;
							flex-direction: row;
							justify-content: space-between;

							.eventName {
								width: 50%;
								color: #333333;
								font-size: 31rpx;
								margin: auto 0;
							}

							.timeAndDate {
								width: 50%;
								font-family: AdobeHeitiStd-Regular;

								.event-time {
									height: 60%;
									color: #333333;
									font-size: 31rpx;
								}

								.event-date {
									height: 40%;
									color: #999999;
									font-size: 24rpx;
								}
							}
						}

					}
				}

				.limit-message,
				.contact-information {
					margin-top: 10rpx;
					min-height: 300rpx;
					background: #FFFFFF;
					border-radius: 14rpx;
					padding-bottom: 50rpx;

					.head {
						display: flex;
						flex-direction: row;
						color: #333333;
						height: 100rpx;
						line-height: 100rpx;
					}
				}
			}
		}

		.card2 {
			margin: 10rpx 0 80rpx 0;
		}

		.weather-content {
			min-height: 180rpx;
			line-height: 180rpx;
			width: 100%;
			border-bottom: solid 2rpx #e5e5e5;
			padding: 20rpx 10rpx;
			text-align: center;

			.weather-part {
				width: 100%;
				min-height: 180rpx;
				display: flex;
				justify-content: space-between;

				.part {
					width: 15%;
					display: flex;
					flex-direction: column;
					text-align: center;

					.icon-class {
						height: 60rpx;
						line-height: 60rpx;

						image {
							width: 40rpx;
							height: 40rpx;
						}
					}

					.content {
						min-height: 30rpx;
						// line-height: 60rpx;
						font-size: 23rpx;
						line-height: 30rpx;
						margin: auto;
						font-weight: bold;
					}

					.type {
						min-width: 50rpx;
						height: 30rpx;
						line-height: 30rpx;

						// border: 2rpx solid #e5e5e5;
						text {
							border: 1rpx solid #d0d0d0;
							color: #838383;
							font-size: 16rpx;
						}
					}
				}
			}
		}
	}
</style>

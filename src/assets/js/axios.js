import axios from 'axios'
import {Message} from 'element-ui'
import Cookie from 'js-cookie'

// axios 超时
axios.defaults.timeout = 8000;

// 异常处理
const error = dat => {
	let data = dat || {status: 0};
	Message.closeAll();
	switch (parseInt(data.status)) {
		case 9001:
			Message.error(data.msg);
			setTimeout(() => window.location.href = '/', 1500);
			break;
		case 9002:
			Message.error(data.msg);
			setTimeout(() => window.location.href = '/', 1500);
			break;
		case 9003:
			Message.error(data.msg);
			setTimeout(() => window.location.href = '/', 1500);
			break;
		default:
			Message.error(data.msg || '网络超时');
			break;
	}
};

// 请求拦截器
axios.interceptors.request.use(req => {
	return req;
}, e => {
	return Promise.reject(e);
});

// 响应拦截器
axios.interceptors.response.use(res => {
	if (res.data.code === 200) {
		return res;
	} else {
		error(res.data);
		return {};
	}
}, e => {
	error(e.response ? e.response.data : {});
	return Promise.reject(e);
});

// 封装请求
export default (url, options = {}) => {
	const autoCommon = options.autoCommon || {};
	let opt = options || {};
	let method = opt.type || 'post';
	if (method === 'get' && method === 'GET')
		opt.params = {...opt.params, ...autoCommon};
	else
		opt.data = {...opt.data, ...autoCommon};
	return new Promise((resolve, reject) => {
		axios({
			method: method,
			url: url,
			baseURL: opt.baseURL || API_ROOT,
			params: opt.params || {},
			data: opt.data || {},
			responseType: opt.dataType || 'json',
			withCredentials: opt.withCredentials || true,
			// 设置默认请求头
			headers: opt.headers || {'Content-Type': 'application/json'}
		}).then(res => {
			resolve(res.data || {})
		}).catch(error => {
			reject(error)
		})
	})
}

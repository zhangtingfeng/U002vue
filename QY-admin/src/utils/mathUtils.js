export default {


	//加法函数
	accAdd(arg1, arg2) {
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length;
		}
		catch (e) {
			r1 = 0;
		}
		try {
			r2 = arg2.toString().split(".")[1].length;
		}
		catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));

		return this.removeZeroNum(((arg1 * m + arg2 * m) / m).toFixed(Math.max(r1, r2)));
	},



	//减法函数
	Subtr(arg1, arg2) {
		if(arg2 == undefined){
			return arg1;
		}
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length;
		}
		catch (e) {
			r1 = 0;
		} 
		try {
			r2 = arg2.toString().split(".")[1].length;
		}
		catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		//last modify by deeka
		//动态控制精度长度
		n = (r1 >= r2) ? r1 : r2; 
		return this.removeZeroNum(((arg1 * m - arg2 * m) / m).toFixed(n));
	},



	//乘法函数
	accMul(arg1, arg2) {
		if (arg1 == null) {
			return;
		}
		if (arg2 == null) {
			return;
		}
		var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length;
		}
		catch (e) {
		}
		try {
			m += s2.split(".")[1].length;
		}
		catch (e) {
		}
		return this.removeZeroNum((Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(4));
	},


	//除法函数
	accDiv(arg1, arg2) {
		var t1 = 0, t2 = 0, r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length;
		}
		catch (e) {
		}
		try {
			t2 = arg2.toString().split(".")[1].length;
		}
		catch (e) {
		}

		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return this.removeZeroNum(((r1 / r2) * pow(10, t2 - t1)).toFixed(4));

	},


	removeZeroNum(arg1) { 
		return parseFloat(Number(arg1));
	}


}
 
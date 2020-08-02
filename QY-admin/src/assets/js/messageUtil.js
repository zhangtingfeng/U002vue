/**
 * 通用的消息提示工具
 */
 export function showMessage(vueComponent,type,message){ //公用的弹窗提示方法。
	       		 	if(type=="success"){ //成功
	       		 	   vueComponent.$message({//弹窗使用方法
		               	    showClose: true,
		               	    duration:3000,  //3000毫秒后消失
		                    message: message,
		                    type: 'success'
		               });
	       		 	}
	       		 	if(type=="error"){ //失败
						vueComponent.$message({//弹窗使用方法
		               	    showClose: true,
		               	    duration:3000,  //警告的消息3秒钟后消失
		                    message: message,
		                    type: 'error'
		               });
	       		 	}
	       		 	if(type=="info"){
	       		 		 vueComponent.$message.info({//弹窗使用方法
		               	    showClose: true,
		               	    duration:3000,  //3000毫秒后消失
		                    message: message,
		              });
	       		 	}
	       		 	if(type=="warn"){
	       		 		 vueComponent.$message.info({//弹窗使用方法
		               	    showClose: true,
		               	    duration:0,  //警告的消息不会自动消失
		                    message: message,
		                    type: 'warning'
		              });
	       		 	}
	       		 	if(type=="errorAndclose"){
	       		 		 vueComponent.$message.info({//弹窗使用方法
		               	    showClose: true,
		               	    duration:3000,  //警告的消息3秒钟后消失
		                    message: message,
		                    type: 'error'
		              });
	       		 	}
};

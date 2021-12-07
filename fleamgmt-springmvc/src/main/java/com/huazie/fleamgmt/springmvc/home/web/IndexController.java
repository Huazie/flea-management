package com.huazie.fleamgmt.springmvc.home.web;

import com.huazie.fleaframework.auth.common.service.interfaces.IFleaUserModuleSV;
import com.huazie.fleaframework.auth.util.FleaAuthLogger;
import com.huazie.fleaframework.common.FleaSessionManager;
import com.huazie.fleaframework.common.IFleaUser;
import com.huazie.fleaframework.common.exception.CommonException;
import com.huazie.fleaframework.common.pojo.OutputCommonData;
import com.huazie.fleaframework.common.slf4j.FleaLogger;
import com.huazie.fleaframework.common.slf4j.impl.FleaLoggerProxy;
import com.huazie.fleaframework.common.util.ObjectUtils;
import com.huazie.fleaframework.core.request.FleaRequestUtil;
import com.huazie.fleamgmt.constant.FleamgmtConstants;
import com.huazie.fleamgmt.module.home.pojo.OutputUserInfo;
import com.huazie.fleamgmt.springmvc.base.web.BusinessController;
import com.huazie.fleamgmt.util.UserInfoUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

/**
 * <p> 首页Controller </p>
 *
 * @author huazie
 * @version 1.0.0
 * @since 1.0.0
 */
@Controller
public class IndexController extends BusinessController {

    private static final FleaLogger LOGGER = FleaLoggerProxy.getProxyInstance(IndexController.class);

    private IFleaUserModuleSV fleaUserModuleSV;

    @Resource(name = "fleaUserModuleSV")
    public void setFleaUserModuleSV(IFleaUserModuleSV fleaUserModuleSV) {
        this.fleaUserModuleSV = fleaUserModuleSV;
    }

    /**
     * <p> 获取用户信息 </p>
     *
     * @return 用户信息
     * @since 1.0.0
     */
    @RequestMapping("fleamgmtIndex!getUserSession.flea")
    @ResponseBody
    public OutputUserInfo getUserSession() {

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Start");
        }

        OutputUserInfo userInfo = UserInfoUtil.getUserInfo();

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("OutputUserInfo = {}", userInfo);
            LOGGER.debug("End");
        }
        return userInfo;
    }

    /**
     * <p> 用户退出 </p>
     *
     * @return 用户退出结果返回信息
     * @since 1.0.0
     */
    @RequestMapping("fleamgmtIndex!quit.flea")
    @ResponseBody
    public OutputCommonData quit(HttpSession httpSession) {

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Start");
        }

        OutputCommonData output = new OutputCommonData();

        try {
            IFleaUser fleaUser = FleaSessionManager.getUserInfo();
            if (ObjectUtils.isNotEmpty(fleaUser)) {
                httpSession.removeAttribute(FleaRequestUtil.getUserSessionKey());
                FleaSessionManager.setUserInfo(null); // 用户信息置空
                // 保存用户当月最近一次登录的退出日志 (异步)
                FleaAuthLogger.asyncSaveQuitLog(fleaUserModuleSV, fleaUser.getAccountId());
                output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_Y);
                output.setRetMess("用户成功退出");
            } else {
                output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_N);
                output.setRetMess("用户登录异常");
            }
        } catch (CommonException e) {
            if (LOGGER.isErrorEnabled()) {
                LOGGER.error("【Spring】用户退出异常：\n", e);
            }
            output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_N);
            output.setRetMess("用户退出异常：" + e.getMessage());
        }

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("End");
        }
        return output;
    }

}

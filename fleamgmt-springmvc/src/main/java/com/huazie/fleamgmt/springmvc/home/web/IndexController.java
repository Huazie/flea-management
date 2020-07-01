package com.huazie.fleamgmt.springmvc.home.web;

import com.huazie.fleamgmt.constant.FleamgmtConstants;
import com.huazie.fleamgmt.module.home.pojo.OutputUserInfo;
import com.huazie.fleamgmt.springmvc.base.web.BusinessController;
import com.huazie.frame.auth.common.service.interfaces.IFleaAuthSV;
import com.huazie.frame.auth.common.service.interfaces.IFleaUserLoginSV;
import com.huazie.frame.auth.util.FleaAuthLogger;
import com.huazie.frame.common.FleaSessionManager;
import com.huazie.frame.common.IFleaUser;
import com.huazie.frame.common.exception.CommonException;
import com.huazie.frame.common.pojo.OutputCommonData;
import com.huazie.frame.core.request.FleaRequestUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(IndexController.class);

    private IFleaAuthSV fleaAuthSV;

    @Resource(name = "fleaAuthSV")
    public void setFleaAuthSV(IFleaAuthSV fleaAuthSV) {
        this.fleaAuthSV = fleaAuthSV;
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
            LOGGER.debug("IndexController##getUserSession() start");
        }

        OutputUserInfo userInfo = new OutputUserInfo();
        IFleaUser fleaUser = FleaSessionManager.getUserInfo();
        if (null != fleaUser) {
            userInfo.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_Y);
            userInfo.setRetMess("用户登录成功");


        } else {
            userInfo.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_N);
            userInfo.setRetMess("用户信息已失效");
        }

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("IndexController##getUserSession() end");
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
            LOGGER.debug("IndexController##quit() start");
        }

        OutputCommonData output = new OutputCommonData();

        try {
            IFleaUser fleaUser = (IFleaUser) httpSession.getAttribute(FleaRequestUtil.getUserSessionKey());
            if (null != fleaUser) {
                httpSession.removeAttribute(FleaRequestUtil.getUserSessionKey());
                FleaSessionManager.setUserInfo(null); // 用户信息置空
                // 保存用户当月最近一次登录的退出日志 (异步)
                FleaAuthLogger.asyncSaveQuitLog(fleaAuthSV, fleaUser.getAcctId());
                output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_Y);
                output.setRetMess("用户成功退出");
            } else {
                output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_N);
                output.setRetMess("用户登录异常");
            }
        } catch (CommonException e) {
            output.setRetCode(FleamgmtConstants.ReturnCodeConstants.RETURN_CODE_N);
            output.setRetMess("用户退出异常：" + e.getMessage());
        }

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("IndexController##quit() end");
        }
        return output;
    }

}

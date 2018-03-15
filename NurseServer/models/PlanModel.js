'use strict';

module.exports = function () {
    this.SerialId = 0;                                                                                              //流水号.
    this.UserId = 0;                                                                                                //用户标识.
    this.HospitalId = 1;                                                                                            //医院标识.
    this.DepartmentId = 0;                                                                                      //科室标识.
    this.DepartmentName = '';                                                                               //科室名称.
    this.OriginalDepartmentId = 0;                                                                          //原科室标识.
    this.OriginalDepartmentName = '';                                                                   //原科室名称.
    this.PlanStartDate = '1900-01-01';                                                                  //计划开始时间.
    this.PlanEndDate = '1900-01-01';                                                                    //计划结束时间.
    this.PlanDuration = 0;                                                                                      //计划时长.
    this.RealityStartDate = '1900-01-01';                                                               //实际开始时间.
    this.RealityEndDate = '1900-01-01';                                                                 //实际结束时间.
    this.RealityDuration = 0;                                                                                   //实际时长.
    this.CoachingId = '';                                                                                        //带教老师标识集.
    this.CoachingName = '';                                                                                     //带教老师姓名集.
    this.RotateStatus = 0;                                                                                      //轮转状态.
    this.IsOfficial = 0;                                                                                            //是否正式(1:正式 0:草稿)
    this.GradeBatch = 0;                                                                                        //年级批次.
    this.DynamicCode = '';                                                                                      //动态入科码.
    this.Remark = '';                                                                                               //备注.
};
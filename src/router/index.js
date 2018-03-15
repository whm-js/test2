import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import selectFromDepartment from '@/components/selectFromDepartment'
import selectFromPeople from '@/components/selectFromPeople'
import trainManage from '@/components/trainManage'
import entryManage from '@/components/entryManage'
import exitManage from '@/components/exitManage'
import exitTeacherManage from '@/components/exitTeacherManage'
import deparmentManage from '@/components/deparmentManage'
import nurseManage from '@/components/nurseManage'
import personal from '@/components/personal'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children:[{
        path: '/selectFromDepartment',
        name: 'selectFromDepartment',
        component: selectFromDepartment
      },
      {
        path: '/selectFromPeople',
        name: 'selectFromPeople',
        component: selectFromPeople
      },
      {
        path: '/trainManage',
        name: 'trainManage',
        component: trainManage
      },
      {
        path: '/entryManage',
        name: 'entryManage',
        component: entryManage
      },
      {
        path: '/exitManage',
        name: 'exitManage',
        component: exitManage
      },
      {
        path: '/exitTeacherManage',
        name: 'exitTeacherManage',
        component: exitTeacherManage
      },
      {
        path: '/deparmentManage',
        name: 'deparmentManage',
        component: deparmentManage
      },
      {
        path: '/nurseManage',
        name: 'nurseManage',
        component: nurseManage
      },
      {
        path: '/personal',
        name: 'personal',
        component: personal
      }]
    }
  ]
})

import Main from './components/Main.vue'
//import GenericDashboard1 from './components/main/GenericDashboard1.vue'
//import GenericDashboard2 from './components/main/GenericDashboard2.vue'
import ClientAdmin from './components/admin/ClientAdmin.vue'
import Tables from './components/main/Tables.vue'
import Tasks from './components/main/Tasks.vue'
import Setting from './components/main/Setting.vue'
//import Server from './components/main/Server.vue'
import MailBox from './components/comms/Mailbox.vue'
import NotFound from './components/404.vue'
import Accessioning from './components/route_pages/Accessioning.vue'
import Worklist from './components/route_pages/Worklist.vue'
import OrderList from './components/route_pages/OrderList.vue'
import SpecimenCatalog from './components/route_pages/SpecimenCatalog.vue'
import MyDashboard from './components/route_pages/MyDashboard.vue'
import SpecimenTracking from './components/route_pages/SpecimenTracking.vue'
import SpecimenView from './components/route_pages/SpecimenView.vue'
import ShoppingCart from './components/route_pages/ShoppingCart.vue'

const routes = [
    {
        path: '/',
        component: Main,
        name: 'Quick Access',
        children: [
            {
                path: '',
                redirect: { name: 'Dashboard' }
            },
            {
                path: 'dashboard',
                component: MyDashboard,
                name: 'Dashboard',
                meta: {
                    title: 'Dashboard',
                    iconClass: 'fa fa-th-large'
                }
            },
            {
                path: 'specimenview/:guid',
                component: SpecimenView,
                name: 'Specimen View',
                description: 'View Specimen Details',
                meta: {
                    showInNavMenu: false,
                    title: 'Specimen Dashboard',
                    iconClass: 'fa fa-search'
                }
            },
            {
                path: 'shoppingCart/:guid?',
                component: ShoppingCart,
                name: 'Pending Acquisitions',
                meta: {
                    title: 'Pending Acquisitions',
                    iconClass: 'fa fa-shopping-cart'
                }
            }
        ]
    },
    {
        path: '/',
        component: Main,
        name: 'Ordering & Tracking',
        description: '',
        meta: { title: 'Ordering & Tracking' },
        children: [
            {
                path: 'editaccession/:guid/:orgNameKey',
                component: Accessioning,
                name: 'Edit Accession',
                description: 'Edit sample/accession',
                meta: {
                    title: 'Accessioning',
                    showInNavMenu: false,
                    hasHistoryItems: true,
                    historyItemName: 'Accessions'
                }
            }, {
                path: 'newaccession',
                component: Accessioning,
                name: 'New Accession',
                description: 'Add sample/accession to the system',
                meta: {
                    title: 'Accessioning',
                    iconClass: 'fa fa-plus',
                    hasHistoryItems: true,
                    historyItemName: 'Accessions'
                }
            }, {
                path: 'specimentracking/:guid?',
                component: SpecimenTracking,
                name: 'Specimen Tracking',
                description: 'Lookup, track and review specimen status/location',
                meta: {
                    title: 'Specimen Dashboard',
                    iconClass: 'fa fa-map-marker'
                }
            }
        ]
    },
    {
        path: '/',
        component: Main,
        name: 'Lists',
        description: '',
        meta: { title: 'Lists' },
        children: [
            {
                path: 'catalog',
                component: SpecimenCatalog,
                name: 'Specimen Catalog',
                description: '',
                meta: {
                    title: 'Catalog',
                    iconClass: 'fa fa-shopping-cart'
                }
            }, {
                path: 'orders',
                component: OrderList,
                name: 'Order List',
                description: '',
                meta: {
                    title: 'Orders',
                    iconClass: 'fa fa-shopping-cart'
                }
            }, {
                path: 'inventory',
                component: Worklist,
                name: 'Specimen Inventory',
                description: '',
                meta: {
                    title: 'Inventory',
                    iconClass: "icon-chemistry"
                }
            }, {
                path: 'specimens',
                component: Worklist,
                name: 'Specimen Worklist',
                description: '',
                meta: {
                    title: 'Worklist',
                    iconClass: 'fa fa-tasks'
                }
            }, {
                path: 'cases',
                component: Worklist,
                name: 'Case Worklist',
                description: '',
                meta: { title: 'Worklist' }
            }
        ]
    },
    {
        path: '/',
        component: Main,
        name: 'Tools',
        description: '',
        meta: { title: 'Tools' },
        children: [
            {
                path: 'admin/clientadmin',
                component: ClientAdmin,
                name: 'Client Admin',
                description: 'Client Administration',
                meta: { title: 'Client Admin' }
            }, {
                path: 'setting',
                component: Setting,
                name: 'Settings',
                description: 'User settings page',
                meta: { title: 'Settings' }
            }, {
                path: 'mailbox',
                component: MailBox,
                name: 'Mailbox',
                meta: { title: 'Mailbox' }
            }
        ]
    },
    {
        // not found handler
        path: '*',
        component: NotFound
    }
]

export default routes

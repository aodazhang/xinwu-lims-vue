// LIMS 统一导航栏组件
class LIMSNavigation {
  constructor() {
    this.config = {
      loginPath: 'login.html'
    }

    this.state = {
      dropdownOpen: false,
      currentRole: '',
      currentUser: ''
    }

    this.roleWorkspaceMap = {
      sales: 'sales-dashboard.html',
      reviewer: 'review-dashboard.html',
      sampling_dispatcher: 'sampling-dispatch.html',
      sampler: 'sampler-workbench.html', // 修改：采样人员工作台
      sampling_staff: 'sampler-workbench.html', // 保持兼容性
      sample_manager: 'sample-management.html',
      'lab-supervisor': 'lab-dashboard.html',
      'lab-technician': 'staff-tasks.html', // 检测员使用独立页面
      report_creator: 'report-dashboard.html',
      report_reviewer: 'review-workspace.html', // 修复：报告审核员返回审核工作台
      report_approver: 'approval-workspace.html', // 添加：报告审批员返回审批工作台
      admin: 'admin-dashboard.html'
    }

    this.init()
  }

  init() {
    // 检查登录状态
    const username = sessionStorage.getItem('username')
    const role = sessionStorage.getItem('role')

    if (!username || !role) {
      window.location.href = this.config.loginPath
      return
    }

    this.state.currentRole = role
    this.state.currentUser = username

    // 创建导航栏
    this.createNavigation()

    // 绑定事件
    this.bindEvents()
  }

  createNavigation() {
    // 创建导航栏HTML
    const navHTML = `
            <nav id="lims-navbar" class="lims-navbar">
                <div class="navbar-container">
                    <div class="navbar-left">
                        <div class="navbar-brand">
                            <svg class="brand-icon" width="32" height="32" viewBox="0 0 32 32">
                                <path d="M16 2L4 8v8c0 7.18 4.82 13.88 12 15.57C23.18 29.88 28 23.18 28 16V8l-12-6z" fill="url(#gradient)"/>
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#667eea"/>
                                        <stop offset="100%" style="stop-color:#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span class="brand-name">LIMS-XW</span>
                        </div>
                        
                        <button id="back-to-workspace" class="nav-button back-button" style="display: none;">
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path d="M10 18l-8-8 8-8 1.41 1.41L5.83 9H18v2H5.83l5.58 5.59z" fill="currentColor"/>
                            </svg>
                            <span>返回工作台</span>
                        </button>
                    </div>

                    <div class="navbar-center">
                        <h1 id="page-title" class="page-title"></h1>
                    </div>

                    <div class="navbar-right">
                        <div class="user-menu-container">
                            <button id="user-menu-trigger" class="user-menu-trigger">
                                <div class="user-avatar">
                                    <span class="avatar-text">${this.state.currentUser.charAt(0).toUpperCase()}</span>
                                </div>
                                <span class="user-name">${this.state.currentUser}</span>
                                <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12">
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                </svg>
                            </button>

                            <div id="user-dropdown" class="user-dropdown">
                                <div class="dropdown-header">
                                    <div class="user-info">
                                        <div class="user-avatar-large">
                                            <span class="avatar-text-large">${this.state.currentUser.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div class="user-details">
                                            <div class="user-fullname">${this.state.currentUser}</div>
                                            <div class="user-role">${this.getRoleDisplayName(this.state.currentRole)}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="dropdown-divider"></div>
                                
                                <ul class="dropdown-menu">
                                    <li>
                                        <button id="logout-btn" class="dropdown-item logout-item">
                                            <svg width="16" height="16" viewBox="0 0 16 16">
                                                <path d="M11 12l4-4-4-4v3H6v2h5v3zm-8-1v2h10V3H3v2H1V3c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-2h2z" fill="currentColor"/>
                                            </svg>
                                            <span>退出登录</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div id="dropdown-backdrop" class="dropdown-backdrop"></div>
        `

    // 创建样式
    const styleHTML = `
            <style>
                :root {
                    --nav-height: 60px;
                    --primary-gradient-start: #667eea;
                    --primary-gradient-end: #764ba2;
                    --nav-bg: #ffffff;
                    --nav-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    --text-primary: #2c3e50;
                    --text-secondary: #64748b;
                    --border-color: #e5e7eb;
                    --hover-bg: #f8f9fa;
                    --dropdown-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    --transition-speed: 0.3s;
                }

                body {
                    padding-top: var(--nav-height);
                    margin: 0;
                }

                .lims-navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--nav-height);
                    background: var(--nav-bg);
                    box-shadow: var(--nav-shadow);
                    z-index: 1000;
                }

                .navbar-container {
                    height: 100%;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .brand-icon {
                    width: 36px;
                    height: 36px;
                }

                .brand-name {
                    font-size: 20px;
                    font-weight: 600;
                    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: white;
                    color: var(--text-primary);
                    font-size: 14px;
                    cursor: pointer;
                    transition: all var(--transition-speed);
                }

                .back-button:hover {
                    background: var(--hover-bg);
                    border-color: var(--primary-gradient-start);
                    color: var(--primary-gradient-start);
                }

                .navbar-center {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .page-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin: 0;
                }

                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-menu-container {
                    position: relative;
                }

                .user-menu-trigger {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 24px;
                    background: transparent;
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all var(--transition-speed);
                }

                .user-menu-trigger:hover {
                    background: var(--hover-bg);
                }

                .user-menu-trigger.active {
                    background: var(--hover-bg);
                }

                .user-avatar, .user-avatar-large {
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
                    color: white;
                    font-weight: bold;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                }

                .user-avatar-large {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }

                .user-name {
                    font-size: 14px;
                    font-weight: 500;
                }

                .dropdown-arrow {
                    transition: transform var(--transition-speed);
                }

                .user-menu-trigger.active .dropdown-arrow {
                    transform: rotate(180deg);
                }

                .user-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 280px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: var(--dropdown-shadow);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all var(--transition-speed);
                    overflow: hidden;
                }

                .user-dropdown.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-header {
                    padding: 20px;
                    background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end));
                    color: white;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .user-details {
                    flex: 1;
                }

                .user-fullname {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .user-role {
                    font-size: 12px;
                    opacity: 0.9;
                    padding: 2px 8px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: inline-block;
                }

                .dropdown-divider {
                    height: 1px;
                    background: var(--border-color);
                }

                .dropdown-menu {
                    list-style: none;
                    margin: 0;
                    padding: 8px 0;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 20px;
                    color: var(--text-primary);
                    font-size: 14px;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                    transition: background var(--transition-speed);
                }

                .dropdown-item:hover {
                    background: var(--hover-bg);
                }

                .logout-item {
                    color: #dc2626;
                }

                .logout-item:hover {
                    background: #fee2e2;
                }

                .dropdown-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--transition-speed);
                    z-index: 999;
                }

                .dropdown-backdrop.show {
                    opacity: 1;
                    visibility: visible;
                }

                @media (max-width: 768px) {
                    .brand-name {
                        display: none;
                    }
                    
                    .navbar-center {
                        display: none;
                    }
                    
                    .user-name {
                        display: none;
                    }
                    
                    .back-button span {
                        display: none;
                    }
                    
                    .back-button {
                        padding: 8px;
                        width: 40px;
                        height: 40px;
                        justify-content: center;
                    }
                }
            </style>
        `

    // 插入到页面
    document.head.insertAdjacentHTML('beforeend', styleHTML)
    document.body.insertAdjacentHTML('afterbegin', navHTML)

    // 检查是否显示返回按钮
    this.checkBackButton()
  }

  checkBackButton() {
    const currentPath = window.location.pathname.split('/').pop()
    const backButton = document.getElementById('back-to-workspace')

    // 定义所有工作台页面（这些页面不应该显示返回按钮）
    const workspacesPages = [
      'sales-dashboard.html',
      'review-dashboard.html',
      'sampling-dispatch.html',
      'sampler-workbench.html',
      'sample-management.html',
      'lab-dashboard.html',
      'staff-tasks.html', // 检测人员工作台
      'report-dashboard.html',
      'review-workspace.html', // 报告审核工作台
      'approval-workspace.html', // 报告审批工作台
      'admin-dashboard.html'
    ]

    // 定义明确需要返回按钮的页面类型
    const detailPages = [
      'detail', // 包括所有detail页面（如sampling-dispatch-detail.html）
      'edit',
      'create',
      'receive',
      'review',
      'task-detail' // 添加任务详情页
    ]

    // 判断是否为工作台页面
    const isWorkspace = workspacesPages.includes(currentPath)

    // 判断是否为详情页面（包含特定关键词的页面）
    // 改进判断逻辑，直接检查文件名是否包含这些关键词
    const isDetailPage = detailPages.some(keyword =>
      currentPath.includes(keyword)
    )

    // 调试信息（生产环境可以删除）
    console.log('Navigation Debug:', {
      currentPath,
      isWorkspace,
      isDetailPage,
      currentRole: this.state.currentRole,
      targetWorkspace: this.roleWorkspaceMap[this.state.currentRole]
    })

    // 只有非工作台页面且是详情类页面才显示返回按钮
    if (backButton) {
      if (!isWorkspace && isDetailPage) {
        backButton.style.display = 'flex'
      } else {
        backButton.style.display = 'none'
      }
    }
  }

  bindEvents() {
    const userMenuTrigger = document.getElementById('user-menu-trigger')
    const userDropdown = document.getElementById('user-dropdown')
    const backdrop = document.getElementById('dropdown-backdrop')
    const backButton = document.getElementById('back-to-workspace')
    const logoutBtn = document.getElementById('logout-btn')
    const brandLogo = document.querySelector('.navbar-brand')

    // 用户菜单
    if (userMenuTrigger) {
      userMenuTrigger.addEventListener('click', e => {
        e.stopPropagation()
        this.toggleDropdown()
      })
    }

    // 背景点击关闭
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeDropdown()
      })
    }

    // 返回工作台
    if (backButton) {
      backButton.addEventListener('click', () => {
        const workspacePage = this.roleWorkspaceMap[this.state.currentRole]
        console.log('Back button clicked:', {
          currentRole: this.state.currentRole,
          targetPage: workspacePage
        })

        if (workspacePage) {
          window.location.href = workspacePage
        } else {
          console.error(
            'No workspace page found for role:',
            this.state.currentRole
          )
          // 备用方案：返回历史记录
          window.history.back()
        }
      })
    }

    // Logo点击返回工作台
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        const currentPath = window.location.pathname.split('/').pop()
        const workspacePage = this.roleWorkspaceMap[this.state.currentRole]

        if (currentPath !== workspacePage && workspacePage) {
          window.location.href = workspacePage
        }
      })
    }

    // 退出登录
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout()
      })
    }

    // ESC关闭
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.state.dropdownOpen) {
        this.closeDropdown()
      }
    })

    // 点击其他地方关闭
    document.addEventListener('click', () => {
      if (this.state.dropdownOpen) {
        this.closeDropdown()
      }
    })
  }

  toggleDropdown() {
    if (this.state.dropdownOpen) {
      this.closeDropdown()
    } else {
      this.openDropdown()
    }
  }

  openDropdown() {
    this.state.dropdownOpen = true
    const trigger = document.getElementById('user-menu-trigger')
    const dropdown = document.getElementById('user-dropdown')
    const backdrop = document.getElementById('dropdown-backdrop')

    if (trigger) trigger.classList.add('active')
    if (dropdown) dropdown.classList.add('show')
    if (backdrop) backdrop.classList.add('show')
  }

  closeDropdown() {
    this.state.dropdownOpen = false
    const trigger = document.getElementById('user-menu-trigger')
    const dropdown = document.getElementById('user-dropdown')
    const backdrop = document.getElementById('dropdown-backdrop')

    if (trigger) trigger.classList.remove('active')
    if (dropdown) dropdown.classList.remove('show')
    if (backdrop) backdrop.classList.remove('show')
  }

  handleLogout() {
    if (confirm('确定要退出登录吗？')) {
      sessionStorage.clear()
      localStorage.clear()
      window.location.href = this.config.loginPath
    }
  }

  getRoleDisplayName(role) {
    const roleNames = {
      sales: '销售人员',
      reviewer: '订单审核员',
      sampling_dispatcher: '采样调度员',
      sampling_staff: '采样人员',
      sample_manager: '样品管理员',
      'lab-supervisor': '实验室主管',
      'lab-technician': '检测员', // 添加检测员角色显示名称
      report_creator: '报告编制员',
      report_reviewer: '报告审核员',
      report_approver: '报告审批员', // 添加报告审批员角色显示名称
      admin: '系统管理员'
    }
    return roleNames[role] || '用户'
  }

  setPageTitle(title) {
    const pageTitle = document.getElementById('page-title')
    if (pageTitle) {
      pageTitle.textContent = title
    }
  }

  // 获取当前角色的工作台页面
  getWorkspacePage() {
    return this.roleWorkspaceMap[this.state.currentRole]
  }

  // 返回到工作台
  goToWorkspace() {
    const workspacePage = this.getWorkspacePage()
    if (workspacePage) {
      window.location.href = workspacePage
      return true
    }
    return false
  }
}

// 自动初始化导航栏
document.addEventListener('DOMContentLoaded', () => {
  window.limsNav = new LIMSNavigation()
})

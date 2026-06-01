document.addEventListener('DOMContentLoaded', () => {

    // ===== DATA =====
    const resourceCategories = [
        {
            name: 'Compute', icon: '>', color: '#ff6b00',
            items: [
                { id: 'ec2', label: 'EC2', type: 'aws_instance', detail: 't3.large', tf: 'aws_instance' },
                { id: 'lambda', label: 'Lambda', type: 'aws_lambda_function', detail: 'Node.js 20', tf: 'aws_lambda_function' },
                { id: 'ecs', label: 'ECS', type: 'aws_ecs_cluster', detail: 'Fargate', tf: 'aws_ecs_cluster' },
                { id: 'autoscaling', label: 'AutoScale', type: 'aws_autoscaling_group', detail: '2-10 instances', tf: 'aws_autoscaling_group' },
                { id: 'lightsail', label: 'Lightsail', type: 'aws_lightsail_instance', detail: 'micro', tf: 'aws_lightsail_instance' },
                { id: 'batch', label: 'Batch', type: 'aws_batch_compute_environment', detail: 'managed', tf: 'aws_batch_compute_environment' },
            ]
        },
        {
            name: 'Network', icon: '~', color: '#3b82f6',
            items: [
                { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc' },
                { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'public', tf: 'aws_subnet' },
                { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb' },
                { id: 'route53', label: 'Route53', type: 'aws_route53_zone', detail: 'public zone', tf: 'aws_route53_zone' },
                { id: 'cloudfront', label: 'CloudFront', type: 'aws_cloudfront_distribution', detail: 'CDN', tf: 'aws_cloudfront_distribution' },
                { id: 'apigateway', label: 'API GW', type: 'aws_api_gateway_rest_api', detail: 'REST', tf: 'aws_api_gateway_rest_api' },
                { id: 'sg', label: 'Sec Group', type: 'aws_security_group', detail: 'ingress/egress', tf: 'aws_security_group' },
                { id: 'natgw', label: 'NAT GW', type: 'aws_nat_gateway', detail: 'elastic IP', tf: 'aws_nat_gateway' },
            ]
        },
        {
            name: 'Database', icon: '#', color: '#8b5cf6',
            items: [
                { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL', tf: 'aws_db_instance' },
                { id: 'dynamodb', label: 'DynamoDB', type: 'aws_dynamodb_table', detail: 'on-demand', tf: 'aws_dynamodb_table' },
                { id: 'elasticache', label: 'ElastiCache', type: 'aws_elasticache_cluster', detail: 'Redis', tf: 'aws_elasticache_cluster' },
                { id: 'aurora', label: 'Aurora', type: 'aws_rds_cluster', detail: 'serverless v2', tf: 'aws_rds_cluster' },
                { id: 'dms', label: 'DMS', type: 'aws_dms_replication_instance', detail: 'migration', tf: 'aws_dms_replication_instance' },
                { id: 'docdb', label: 'DocumentDB', type: 'aws_docdb_cluster', detail: 'MongoDB compat', tf: 'aws_docdb_cluster' },
                { id: 'neptune', label: 'Neptune', type: 'aws_neptune_cluster', detail: 'graph DB', tf: 'aws_neptune_cluster' },
                { id: 'timestream', label: 'Timestream', type: 'aws_timestreamwrite_database', detail: 'time series', tf: 'aws_timestreamwrite_database' },
            ]
        },
        {
            name: 'Storage', icon: '=', color: '#10b981',
            items: [
                { id: 's3', label: 'S3', type: 'aws_s3_bucket', detail: 'private', tf: 'aws_s3_bucket' },
                { id: 'efs', label: 'EFS', type: 'aws_efs_file_system', detail: 'general purpose', tf: 'aws_efs_file_system' },
                { id: 'ebs', label: 'EBS', type: 'aws_ebs_volume', detail: 'gp3, 100GB', tf: 'aws_ebs_volume' },
            ]
        },
        {
            name: 'Security', icon: '!', color: '#ef4444',
            items: [
                { id: 'iam_role', label: 'IAM Role', type: 'aws_iam_role', detail: 'assume role', tf: 'aws_iam_role' },
                { id: 'iam_policy', label: 'IAM Policy', type: 'aws_iam_policy', detail: 'custom', tf: 'aws_iam_policy' },
                { id: 'kms', label: 'KMS', type: 'aws_kms_key', detail: 'symmetric', tf: 'aws_kms_key' },
                { id: 'waf', label: 'WAF', type: 'aws_wafv2_web_acl', detail: 'regional', tf: 'aws_wafv2_web_acl' },
                { id: 'acm', label: 'ACM', type: 'aws_acm_certificate', detail: 'SSL/TLS', tf: 'aws_acm_certificate' },
                { id: 'cognito', label: 'Cognito', type: 'aws_cognito_user_pool', detail: 'user pool', tf: 'aws_cognito_user_pool' },
                { id: 'guardduty', label: 'GuardDuty', type: 'aws_guardduty_detector', detail: 'threat detect', tf: 'aws_guardduty_detector' },
                { id: 'secrets', label: 'Secrets Mgr', type: 'aws_secretsmanager_secret', detail: 'secret store', tf: 'aws_secretsmanager_secret' },
            ]
        },
    ];

    const templates = [
        { icon: 'WEB', name: 'Web App with ALB & Auto Scaling', desc: 'Production-ready web application with load balancing and auto-scaling.', tags: ['EC2', 'ALB', 'ASG', 'VPC'], filter: 'compute' },
        { icon: 'API', name: 'Serverless API', desc: 'API Gateway + Lambda + DynamoDB serverless architecture.', tags: ['Lambda', 'API GW', 'DynamoDB'], filter: 'serverless' },
        { icon: 'ECS', name: 'Container Platform (ECS)', desc: 'ECS Fargate cluster with ALB and RDS database backend.', tags: ['ECS', 'ALB', 'RDS', 'VPC'], filter: 'compute' },
        { icon: 'S3', name: 'Data Lake', desc: 'S3-based data lake with encryption and IAM access controls.', tags: ['S3', 'KMS', 'IAM'], filter: 'data' },
        { icon: 'VPC', name: 'Secure VPC Network', desc: 'Multi-AZ VPC with public/private subnets, NAT, and bastion host.', tags: ['VPC', 'Subnet', 'NAT', 'SG'], filter: 'network' },
        { icon: 'MON', name: 'Monitoring Stack', desc: 'CloudWatch dashboards, alarms, and SNS notifications.', tags: ['CloudWatch', 'SNS', 'Logs'], filter: 'compute' },
    ];

    const categoryColors = { Compute: '#ff6b00', Network: '#3b82f6', Database: '#8b5cf6', Storage: '#10b981', Security: '#ef4444' };

    const costMap = {
        ec2: 62.05, lambda: 5.00, ecs: 36.50, autoscaling: 120.00, lightsail: 5.00, batch: 0,
        vpc: 0, subnet: 0, alb: 22.27, route53: 0.50, cloudfront: 15.00, apigateway: 3.50, sg: 0, natgw: 32.40,
        rds: 172.80, dynamodb: 25.00, elasticache: 51.84, aurora: 210.00,
        s3: 2.30, efs: 30.00, ebs: 8.00,
        iam_role: 0, iam_policy: 0, kms: 1.00, waf: 10.00
    };

    // ===== STATE =====
    let canvasNodes = [];
    let connections = [];
    let nodeIdCounter = 0;
    let connectionIdCounter = 0;
    let draggedResource = null;
    let selectedNodes = new Set();
    let isDraggingNode = false;
    let dragOffset = { x: 0, y: 0 };
    let isPanning = false;
    let panStart = { x: 0, y: 0 };
    let panOffset = { x: 0, y: 0 };
    let zoomLevel = 1;
    let snapToGrid = false;
    let gridSize = 24;
    let isConnecting = false;
    let connectionStart = null;
    let tempConnectionLine = null;
    let undoStack = [];
    let redoStack = [];
    let activeCodeFile = 'main';
    let planComplete = false;

    // ===== DOM REFS =====
    const canvasContainer = document.getElementById('canvas-container');
    const canvasArea = document.getElementById('canvas-area');
    const canvasSvg = document.getElementById('canvas-svg');
    const categoriesContainer = document.getElementById('resource-categories');
    const codePanel = document.getElementById('code-panel');
    const codeToggle = document.getElementById('toggle-code');
    const contextMenu = document.getElementById('context-menu');
    let contextNodeId = null;

    // ===== THEME =====
    function initTheme() {
        const saved = localStorage.getItem('cf-theme') || 'light';
        applyTheme(saved);
    }

    function applyTheme(theme) {
        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('cf-theme', theme);
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === localStorage.getItem('cf-theme'));
        });
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('designer-theme-toggle')?.addEventListener('click', toggleTheme);
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    initTheme();

    // ===== TOAST =====
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        const icons = { success: '&#10003;', error: '&#10007;', info: 'i', warning: '!' };
        toast.innerHTML = `<div class="toast-icon ${type}">${icons[type] || icons.info}</div><span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('visible')); });
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== UNDO / REDO =====
    function saveState() {
        undoStack.push(JSON.stringify({ nodes: canvasNodes, connections }));
        if (undoStack.length > 50) undoStack.shift();
        redoStack = [];
        updateUndoRedoButtons();
    }

    function undo() {
        if (undoStack.length === 0) return;
        redoStack.push(JSON.stringify({ nodes: canvasNodes, connections }));
        const state = JSON.parse(undoStack.pop());
        restoreState(state);
        showToast('Undo', 'info');
    }

    function redo() {
        if (redoStack.length === 0) return;
        undoStack.push(JSON.stringify({ nodes: canvasNodes, connections }));
        const state = JSON.parse(redoStack.pop());
        restoreState(state);
        showToast('Redo', 'info');
    }

    function restoreState(state) {
        canvasNodes = state.nodes;
        connections = state.connections || [];
        canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
        canvasNodes.forEach(n => renderCanvasNode(n));
        updateCode();
        drawConnections();
        updateStatusBar();
        if (canvasNodes.length === 0) showCanvasEmpty(); else hideCanvasEmpty();
        updateUndoRedoButtons();
    }

    function updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        if (undoBtn) undoBtn.disabled = undoStack.length === 0;
        if (redoBtn) redoBtn.disabled = redoStack.length === 0;
    }

    document.getElementById('undo-btn')?.addEventListener('click', undo);
    document.getElementById('redo-btn')?.addEventListener('click', redo);

    // ===== RENDER RESOURCE PANEL =====
    function renderResources(filter = '') {
        categoriesContainer.innerHTML = '';
        resourceCategories.forEach(cat => {
            const filtered = filter ? cat.items.filter(i => i.label.toLowerCase().includes(filter.toLowerCase()) || i.type.toLowerCase().includes(filter.toLowerCase())) : cat.items;
            if (filtered.length === 0) return;

            const catDiv = document.createElement('div');
            catDiv.className = 'res-category';
            catDiv.innerHTML = `
                <div class="res-cat-header">
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 2L9 6L3 10" fill="currentColor"/></svg>
                    ${cat.name}
                    <span style="color:var(--text-muted);font-size:0.7rem;margin-left:auto;">${filtered.length}</span>
                </div>
                <div class="res-cat-grid">
                    ${filtered.map(item => `
                        <div class="resource-item" data-resource='${JSON.stringify(item).replace(/'/g, "&#39;")}' data-cat="${cat.name}" draggable="true">
                            <div class="res-item-icon" style="background: ${categoryColors[cat.name]}">${item.label.substring(0, 3).toUpperCase()}</div>
                            <span>${item.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            categoriesContainer.appendChild(catDiv);

            const header = catDiv.querySelector('.res-cat-header');
            const grid = catDiv.querySelector('.res-cat-grid');
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                grid.classList.toggle('collapsed');
            });
        });
        setupDragAndDrop();
    }

    // Provider-specific resources
    const providerResources = {
        azure: [
            { name: 'Compute', color: '#0078d4', items: [
                { id: 'azure_vm', label: 'VM', type: 'azurerm_virtual_machine', detail: 'Standard_D2s_v3', tf: 'azurerm_virtual_machine' },
                { id: 'azure_func', label: 'Functions', type: 'azurerm_function_app', detail: 'Consumption', tf: 'azurerm_function_app' },
                { id: 'azure_aks', label: 'AKS', type: 'azurerm_kubernetes_cluster', detail: 'managed K8s', tf: 'azurerm_kubernetes_cluster' },
                { id: 'azure_container', label: 'Container', type: 'azurerm_container_group', detail: 'ACI', tf: 'azurerm_container_group' },
            ]},
            { name: 'Network', color: '#0078d4', items: [
                { id: 'azure_vnet', label: 'VNet', type: 'azurerm_virtual_network', detail: '10.0.0.0/16', tf: 'azurerm_virtual_network' },
                { id: 'azure_subnet', label: 'Subnet', type: 'azurerm_subnet', detail: 'default', tf: 'azurerm_subnet' },
                { id: 'azure_lb', label: 'Load Bal.', type: 'azurerm_lb', detail: 'Standard', tf: 'azurerm_lb' },
                { id: 'azure_appgw', label: 'App GW', type: 'azurerm_application_gateway', detail: 'WAF_v2', tf: 'azurerm_application_gateway' },
                { id: 'azure_nsg', label: 'NSG', type: 'azurerm_network_security_group', detail: 'rules', tf: 'azurerm_network_security_group' },
            ]},
            { name: 'Database', color: '#0078d4', items: [
                { id: 'azure_sql', label: 'SQL DB', type: 'azurerm_mssql_database', detail: 'SQL Server', tf: 'azurerm_mssql_database' },
                { id: 'azure_cosmos', label: 'Cosmos DB', type: 'azurerm_cosmosdb_account', detail: 'multi-model', tf: 'azurerm_cosmosdb_account' },
                { id: 'azure_redis', label: 'Redis', type: 'azurerm_redis_cache', detail: 'Premium', tf: 'azurerm_redis_cache' },
                { id: 'azure_postgres', label: 'PostgreSQL', type: 'azurerm_postgresql_flexible_server', detail: 'Flexible', tf: 'azurerm_postgresql_flexible_server' },
            ]},
            { name: 'Storage', color: '#0078d4', items: [
                { id: 'azure_storage', label: 'Storage', type: 'azurerm_storage_account', detail: 'StorageV2', tf: 'azurerm_storage_account' },
                { id: 'azure_blob', label: 'Blob', type: 'azurerm_storage_container', detail: 'private', tf: 'azurerm_storage_container' },
            ]},
        ],
        gcp: [
            { name: 'Compute', color: '#4285f4', items: [
                { id: 'gcp_instance', label: 'GCE', type: 'google_compute_instance', detail: 'e2-medium', tf: 'google_compute_instance' },
                { id: 'gcp_function', label: 'Cloud Func', type: 'google_cloudfunctions2_function', detail: 'Gen2', tf: 'google_cloudfunctions2_function' },
                { id: 'gcp_gke', label: 'GKE', type: 'google_container_cluster', detail: 'Autopilot', tf: 'google_container_cluster' },
                { id: 'gcp_run', label: 'Cloud Run', type: 'google_cloud_run_v2_service', detail: 'serverless', tf: 'google_cloud_run_v2_service' },
            ]},
            { name: 'Network', color: '#4285f4', items: [
                { id: 'gcp_vpc', label: 'VPC', type: 'google_compute_network', detail: 'auto mode', tf: 'google_compute_network' },
                { id: 'gcp_subnet', label: 'Subnet', type: 'google_compute_subnetwork', detail: 'regional', tf: 'google_compute_subnetwork' },
                { id: 'gcp_lb', label: 'Load Bal.', type: 'google_compute_global_forwarding_rule', detail: 'HTTPS', tf: 'google_compute_global_forwarding_rule' },
                { id: 'gcp_firewall', label: 'Firewall', type: 'google_compute_firewall', detail: 'rules', tf: 'google_compute_firewall' },
            ]},
            { name: 'Database', color: '#4285f4', items: [
                { id: 'gcp_sql', label: 'Cloud SQL', type: 'google_sql_database_instance', detail: 'PostgreSQL', tf: 'google_sql_database_instance' },
                { id: 'gcp_spanner', label: 'Spanner', type: 'google_spanner_instance', detail: 'regional', tf: 'google_spanner_instance' },
                { id: 'gcp_firestore', label: 'Firestore', type: 'google_firestore_database', detail: 'Native', tf: 'google_firestore_database' },
                { id: 'gcp_bigtable', label: 'Bigtable', type: 'google_bigtable_instance', detail: 'Production', tf: 'google_bigtable_instance' },
            ]},
            { name: 'Storage', color: '#4285f4', items: [
                { id: 'gcp_bucket', label: 'GCS', type: 'google_storage_bucket', detail: 'Standard', tf: 'google_storage_bucket' },
                { id: 'gcp_disk', label: 'Disk', type: 'google_compute_disk', detail: 'pd-ssd', tf: 'google_compute_disk' },
            ]},
        ],
        oci: [
            { name: 'Compute', color: '#c74634', items: [
                { id: 'oci_instance', label: 'Instance', type: 'oci_core_instance', detail: 'VM.Standard', tf: 'oci_core_instance' },
                { id: 'oci_container', label: 'OKE', type: 'oci_containerengine_cluster', detail: 'managed K8s', tf: 'oci_containerengine_cluster' },
            ]},
            { name: 'Network', color: '#c74634', items: [
                { id: 'oci_vcn', label: 'VCN', type: 'oci_core_vcn', detail: '10.0.0.0/16', tf: 'oci_core_vcn' },
                { id: 'oci_subnet', label: 'Subnet', type: 'oci_core_subnet', detail: 'regional', tf: 'oci_core_subnet' },
                { id: 'oci_lb', label: 'Load Bal.', type: 'oci_load_balancer', detail: 'flexible', tf: 'oci_load_balancer' },
            ]},
            { name: 'Database', color: '#c74634', items: [
                { id: 'oci_adb', label: 'Auto DB', type: 'oci_database_autonomous_database', detail: 'Serverless', tf: 'oci_database_autonomous_database' },
                { id: 'oci_mysql', label: 'MySQL', type: 'oci_mysql_mysql_db_system', detail: 'HeatWave', tf: 'oci_mysql_mysql_db_system' },
            ]},
            { name: 'Storage', color: '#c74634', items: [
                { id: 'oci_bucket', label: 'Bucket', type: 'oci_objectstorage_bucket', detail: 'Standard', tf: 'oci_objectstorage_bucket' },
            ]},
        ],
        kubernetes: [
            { name: 'Workloads', color: '#326ce5', items: [
                { id: 'k8s_deploy', label: 'Deployment', type: 'kubernetes_deployment_v1', detail: 'replicas: 3', tf: 'kubernetes_deployment_v1' },
                { id: 'k8s_service', label: 'Service', type: 'kubernetes_service_v1', detail: 'LoadBalancer', tf: 'kubernetes_service_v1' },
                { id: 'k8s_ingress', label: 'Ingress', type: 'kubernetes_ingress_v1', detail: 'nginx', tf: 'kubernetes_ingress_v1' },
                { id: 'k8s_configmap', label: 'ConfigMap', type: 'kubernetes_config_map_v1', detail: 'key-value', tf: 'kubernetes_config_map_v1' },
                { id: 'k8s_secret', label: 'Secret', type: 'kubernetes_secret_v1', detail: 'Opaque', tf: 'kubernetes_secret_v1' },
                { id: 'k8s_ns', label: 'Namespace', type: 'kubernetes_namespace_v1', detail: 'isolation', tf: 'kubernetes_namespace_v1' },
            ]},
            { name: 'Storage', color: '#326ce5', items: [
                { id: 'k8s_pvc', label: 'PVC', type: 'kubernetes_persistent_volume_claim_v1', detail: '10Gi', tf: 'kubernetes_persistent_volume_claim_v1' },
                { id: 'k8s_pv', label: 'PV', type: 'kubernetes_persistent_volume_v1', detail: 'hostPath', tf: 'kubernetes_persistent_volume_v1' },
            ]},
        ],
    };

    let activeProvider = 'aws';

    // Provider dropdown toggle
    document.getElementById('provider-badge-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('provider-dropdown').classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.provider-select')) {
            document.getElementById('provider-dropdown')?.classList.remove('active');
        }
    });

    // Provider option click
    document.querySelectorAll('.provider-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const provider = opt.dataset.provider;
            const version = opt.dataset.version;
            const color = opt.dataset.color;
            const name = opt.querySelector('span').textContent;
            const iconText = opt.querySelector('.po-icon').textContent;

            // Update active state
            document.querySelectorAll('.provider-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            // Update badge
            const badge = document.getElementById('active-provider-icon');
            badge.textContent = iconText;
            badge.style.background = color;
            document.getElementById('active-provider-name').textContent = name;
            document.getElementById('provider-version').innerHTML = version ? `<option>${version}</option>` : '<option>latest</option>';

            // Close dropdown
            document.getElementById('provider-dropdown').classList.remove('active');

            // Switch resources
            activeProvider = provider;
            if (provider === 'aws') {
                renderResources();
            } else if (providerResources[provider]) {
                renderProviderResources(providerResources[provider]);
            } else {
                // Custom or unsupported - show empty with message
                categoriesContainer.innerHTML = `<div style="text-align:center;padding:30px 10px;color:var(--text-muted);font-size:0.85rem;"><p style="font-weight:600;margin-bottom:8px;">${name} Resources</p><p>Search and drag ${name} Terraform resources onto the canvas.</p></div>`;
            }

            showToast(`Switched to ${name} provider`, 'success');
        });
    });

    function renderProviderResources(categories) {
        categoriesContainer.innerHTML = '';
        categories.forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.className = 'res-category';
            catDiv.innerHTML = `
                <div class="res-cat-header">
                    <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 2L9 6L3 10" fill="currentColor"/></svg>
                    ${cat.name}
                    <span style="color:var(--text-muted);font-size:0.7rem;margin-left:auto;">${cat.items.length}</span>
                </div>
                <div class="res-cat-grid">
                    ${cat.items.map(item => `
                        <div class="resource-item" data-resource='${JSON.stringify(item).replace(/'/g, "&#39;")}' data-cat="${cat.name}" draggable="true">
                            <div class="res-item-icon" style="background: ${cat.color}">${item.label.substring(0, 3).toUpperCase()}</div>
                            <span>${item.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            categoriesContainer.appendChild(catDiv);

            const header = catDiv.querySelector('.res-cat-header');
            const grid = catDiv.querySelector('.res-cat-grid');
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                grid.classList.toggle('collapsed');
            });
        });
        setupDragAndDrop();
    }

    renderResources();

    document.getElementById('resource-search-input').addEventListener('input', (e) => {
        if (activeProvider === 'aws') {
            renderResources(e.target.value);
        } else if (providerResources[activeProvider]) {
            const filter = e.target.value.toLowerCase();
            const filtered = providerResources[activeProvider].map(cat => ({
                ...cat,
                items: cat.items.filter(i => i.label.toLowerCase().includes(filter) || i.type.toLowerCase().includes(filter))
            })).filter(cat => cat.items.length > 0);
            renderProviderResources(filtered);
        }
    });

    // Sub-tabs
    document.querySelectorAll('.sub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const subtab = tab.dataset.subtab;
            document.getElementById('resource-categories').style.display = subtab === 'resources' ? '' : 'none';
            document.getElementById('variables-panel').style.display = subtab === 'variables' ? '' : 'none';
            document.getElementById('locals-panel').style.display = subtab === 'locals' ? '' : 'none';
            document.getElementById('outputs-panel').style.display = subtab === 'outputs' ? '' : 'none';
        });
    });

    // ===== DRAG AND DROP =====
    function setupDragAndDrop() {
        document.querySelectorAll('.resource-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedResource = JSON.parse(item.dataset.resource.replace(/&#39;/g, "'"));
                draggedResource.catName = item.dataset.cat;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', '');
            });
            item.addEventListener('dragend', () => { draggedResource = null; });
        });
    }

    canvasContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    canvasContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedResource) return;
        const rect = canvasContainer.getBoundingClientRect();
        let x = (e.clientX - rect.left - panOffset.x) / zoomLevel - 85;
        let y = (e.clientY - rect.top - panOffset.y) / zoomLevel - 30;
        if (snapToGrid) { x = Math.round(x / gridSize) * gridSize; y = Math.round(y / gridSize) * gridSize; }
        saveState();
        addNodeToCanvas(draggedResource, Math.max(0, x), Math.max(0, y));
        draggedResource = null;
    });

    // ===== CANVAS NODES =====
    function addNodeToCanvas(resource, x, y) {
        const id = `node-${nodeIdCounter++}`;
        const color = categoryColors[resource.catName] || '#6366f1';
        const name = `${resource.label.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 100)}`;
        const node = { id, resource: { ...resource }, name, color, x: Math.max(0, x), y: Math.max(0, y), detail: resource.detail };
        canvasNodes.push(node);
        renderCanvasNode(node);
        updateCode();
        updateStatusBar();
        hideCanvasEmpty();
        showToast(`${resource.label} added to canvas`, 'success');
        saveToLocalStorage();
    }

    function renderCanvasNode(node) {
        const div = document.createElement('div');
        div.className = 'canvas-node just-added';
        div.id = node.id;
        div.style.left = node.x + 'px';
        div.style.top = node.y + 'px';
        div.innerHTML = `
            <button class="node-delete" data-id="${node.id}">&times;</button>
            <div class="node-port port-top" data-port="top" data-node="${node.id}"></div>
            <div class="node-port port-bottom" data-port="bottom" data-node="${node.id}"></div>
            <div class="node-port port-left" data-port="left" data-node="${node.id}"></div>
            <div class="node-port port-right" data-port="right" data-node="${node.id}"></div>
            <div class="node-top">
                <div class="node-type-icon" style="background: ${node.color}">${node.resource.label.substring(0, 3).toUpperCase()}</div>
                <div class="node-type-label">${node.resource.type}</div>
                <div class="node-status-dot"></div>
            </div>
            <div class="node-body">
                <div class="node-name">${node.name}</div>
                <div class="node-detail">${node.detail}</div>
            </div>
        `;
        canvasArea.appendChild(div);
        setTimeout(() => div.classList.remove('just-added'), 300);

        // Mouse down for dragging
        div.addEventListener('mousedown', (e) => {
            if (e.target.closest('.node-delete') || e.target.closest('.node-port')) return;
            if (e.button === 2) return;

            if (e.shiftKey) {
                if (selectedNodes.has(node.id)) selectedNodes.delete(node.id);
                else selectedNodes.add(node.id);
            } else if (!selectedNodes.has(node.id)) {
                selectedNodes.clear();
                selectedNodes.add(node.id);
            }
            updateNodeSelectionVisuals();

            isDraggingNode = true;
            const rect = div.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            highlightNodeCode(node.id);
            e.preventDefault();
        });

        // Double click for properties
        div.addEventListener('dblclick', (e) => {
            if (e.target.closest('.node-delete') || e.target.closest('.node-port')) return;
            openPropertiesPanel(node.id);
        });

        // Right click for context menu
        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextNodeId = node.id;
            if (!selectedNodes.has(node.id)) {
                selectedNodes.clear();
                selectedNodes.add(node.id);
                updateNodeSelectionVisuals();
            }
            showContextMenu(e.clientX, e.clientY);
        });

        // Delete button
        div.querySelector('.node-delete').addEventListener('click', () => {
            saveState();
            deleteNode(node.id);
        });

        // Connection ports
        div.querySelectorAll('.node-port').forEach(port => {
            port.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                isConnecting = true;
                connectionStart = { nodeId: node.id, port: port.dataset.port };
                canvasContainer.classList.add('connecting');
            });
        });
    }

    function deleteNode(nodeId) {
        canvasNodes = canvasNodes.filter(n => n.id !== nodeId);
        connections = connections.filter(c => c.from.nodeId !== nodeId && c.to.nodeId !== nodeId);
        selectedNodes.delete(nodeId);
        const el = document.getElementById(nodeId);
        if (el) el.remove();
        updateCode();
        drawConnections();
        updateStatusBar();
        if (canvasNodes.length === 0) showCanvasEmpty();
        showToast('Resource removed', 'info');
        saveToLocalStorage();
    }

    function duplicateNode(nodeId) {
        const orig = canvasNodes.find(n => n.id === nodeId);
        if (!orig) return;
        saveState();
        addNodeToCanvas({ ...orig.resource, catName: orig.resource.catName || 'Compute' }, orig.x + 30, orig.y + 30);
    }

    // ===== NODE DRAGGING =====
    document.addEventListener('mousemove', (e) => {
        // Node dragging
        if (isDraggingNode && selectedNodes.size > 0) {
            const firstId = [...selectedNodes][0];
            const firstNode = canvasNodes.find(n => n.id === firstId);
            if (!firstNode) return;

            const containerRect = canvasContainer.getBoundingClientRect();
            let newX = (e.clientX - containerRect.left - panOffset.x) / zoomLevel - dragOffset.x;
            let newY = (e.clientY - containerRect.top - panOffset.y) / zoomLevel - dragOffset.y;

            if (snapToGrid) { newX = Math.round(newX / gridSize) * gridSize; newY = Math.round(newY / gridSize) * gridSize; }

            const dx = newX - firstNode.x;
            const dy = newY - firstNode.y;

            selectedNodes.forEach(id => {
                const node = canvasNodes.find(n => n.id === id);
                if (!node) return;
                node.x = Math.max(0, node.x + dx);
                node.y = Math.max(0, node.y + dy);
                const el = document.getElementById(id);
                if (el) { el.style.left = node.x + 'px'; el.style.top = node.y + 'px'; }
            });
            drawConnections();
            updateMinimap();
        }

        // Connection drawing
        if (isConnecting && connectionStart) {
            const containerRect = canvasContainer.getBoundingClientRect();
            const mx = (e.clientX - containerRect.left - panOffset.x) / zoomLevel;
            const my = (e.clientY - containerRect.top - panOffset.y) / zoomLevel;
            const startPos = getPortPosition(connectionStart.nodeId, connectionStart.port);
            drawTempConnection(startPos.x, startPos.y, mx, my);
        }

        // Panning
        if (isPanning) {
            panOffset.x = e.clientX - panStart.x;
            panOffset.y = e.clientY - panStart.y;
            applyCanvasTransform();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDraggingNode) {
            isDraggingNode = false;
            saveToLocalStorage();
        }

        if (isConnecting && connectionStart) {
            const port = e.target.closest('.node-port');
            if (port && port.dataset.node !== connectionStart.nodeId) {
                const exists = connections.some(c =>
                    (c.from.nodeId === connectionStart.nodeId && c.to.nodeId === port.dataset.node) ||
                    (c.from.nodeId === port.dataset.node && c.to.nodeId === connectionStart.nodeId)
                );
                if (!exists) {
                    saveState();
                    connections.push({
                        id: `conn-${connectionIdCounter++}`,
                        from: { ...connectionStart },
                        to: { nodeId: port.dataset.node, port: port.dataset.port }
                    });
                    showToast('Connection created', 'success');
                    drawConnections();
                    updateStatusBar();
                    saveToLocalStorage();
                }
            }
            removeTempConnection();
            isConnecting = false;
            connectionStart = null;
            canvasContainer.classList.remove('connecting');
        }

        if (isPanning) {
            isPanning = false;
            canvasContainer.classList.remove('panning');
        }
    });

    // Canvas click to deselect
    canvasContainer.addEventListener('mousedown', (e) => {
        if (e.target === canvasContainer || e.target === canvasArea || e.target.closest('.canvas-empty')) {
            if (!e.shiftKey && !e.target.closest('.canvas-node') && !e.target.closest('.canvas-controls') && !e.target.closest('.minimap') && !e.target.closest('.canvas-status')) {
                selectedNodes.clear();
                updateNodeSelectionVisuals();
                contextMenu.classList.remove('active');
            }
        }

        // Space panning
        if (e.target === canvasContainer || e.target === canvasArea || e.target.classList?.contains('canvas-empty')) {
            if (e.button === 1 || (e.button === 0 && e.altKey)) {
                isPanning = true;
                panStart.x = e.clientX - panOffset.x;
                panStart.y = e.clientY - panOffset.y;
                canvasContainer.classList.add('panning');
                e.preventDefault();
            }
        }
    });

    // Wheel zoom
    canvasContainer.addEventListener('wheel', (e) => {
        if (e.target.closest('.minimap') || e.target.closest('.canvas-controls')) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        zoomLevel = Math.min(2, Math.max(0.3, zoomLevel + delta));
        applyCanvasTransform();
        document.getElementById('zoom-level').textContent = Math.round(zoomLevel * 100) + '%';
    }, { passive: false });

    function applyCanvasTransform() {
        canvasArea.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`;
        // SVG is now inside canvasArea, no separate transform needed
        updateMinimap();
    }

    function updateNodeSelectionVisuals() {
        canvasArea.querySelectorAll('.canvas-node').forEach(el => {
            el.classList.remove('selected', 'multi-selected');
            if (selectedNodes.has(el.id)) {
                el.classList.add(selectedNodes.size > 1 ? 'multi-selected' : 'selected');
            }
        });
    }

    // ===== CONNECTIONS =====
    function getPortPosition(nodeId, portName) {
        const el = document.getElementById(nodeId);
        if (!el) return { x: 0, y: 0 };
        const node = canvasNodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        switch (portName) {
            case 'top': return { x: node.x + w / 2, y: node.y };
            case 'bottom': return { x: node.x + w / 2, y: node.y + h };
            case 'left': return { x: node.x, y: node.y + h / 2 };
            case 'right': return { x: node.x + w, y: node.y + h / 2 };
            default: return { x: node.x + w / 2, y: node.y + h / 2 };
        }
    }

    function drawConnections() {
        canvasSvg.innerHTML = '';
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '10');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('class', 'connection-arrow');
        marker.appendChild(polygon);
        defs.appendChild(marker);
        canvasSvg.appendChild(defs);

        connections.forEach(conn => {
            const from = getPortPosition(conn.from.nodeId, conn.from.port);
            const to = getPortPosition(conn.to.nodeId, conn.to.port);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = getBezierPath(from, to, conn.from.port, conn.to.port);
            path.setAttribute('d', d);
            path.setAttribute('class', 'connection-line');
            path.setAttribute('marker-end', 'url(#arrowhead)');
            path.dataset.connectionId = conn.id;
            path.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Delete this connection?')) {
                    saveState();
                    connections = connections.filter(c => c.id !== conn.id);
                    drawConnections();
                    updateStatusBar();
                    saveToLocalStorage();
                }
            });
            canvasSvg.appendChild(path);
        });

        // Add flowing animation to all connection lines
        canvasSvg.querySelectorAll('.connection-line').forEach(line => line.classList.add('animated'));

        // Also draw auto-connections for adjacent nodes if no manual connections
        if (connections.length === 0 && canvasNodes.length > 1) {
            for (let i = 0; i < canvasNodes.length - 1; i++) {
                const a = canvasNodes[i];
                const b = canvasNodes[i + 1];
                const aEl = document.getElementById(a.id);
                const bEl = document.getElementById(b.id);
                if (!aEl || !bEl) continue;
                const ax = a.x + aEl.offsetWidth / 2;
                const ay = a.y + aEl.offsetHeight / 2;
                const bx = b.x + bEl.offsetWidth / 2;
                const by = b.y + bEl.offsetHeight / 2;
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', ax);
                line.setAttribute('y1', ay);
                line.setAttribute('x2', bx);
                line.setAttribute('y2', by);
                line.setAttribute('stroke', 'var(--primary)');
                line.setAttribute('stroke-width', '1.5');
                line.setAttribute('stroke-dasharray', '6 4');
                line.setAttribute('opacity', '0.2');
                canvasSvg.appendChild(line);
            }
        }
    }

    function getBezierPath(from, to, fromPort, toPort) {
        const dx = Math.abs(to.x - from.x);
        const dy = Math.abs(to.y - from.y);
        const offset = Math.max(50, Math.min(dx, dy) * 0.5);

        let c1x = from.x, c1y = from.y, c2x = to.x, c2y = to.y;

        if (fromPort === 'right') c1x += offset;
        else if (fromPort === 'left') c1x -= offset;
        else if (fromPort === 'bottom') c1y += offset;
        else if (fromPort === 'top') c1y -= offset;

        if (toPort === 'right') c2x += offset;
        else if (toPort === 'left') c2x -= offset;
        else if (toPort === 'bottom') c2y += offset;
        else if (toPort === 'top') c2y -= offset;

        return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
    }

    function drawTempConnection(x1, y1, x2, y2) {
        removeTempConnection();
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const mx = (x1 + x2) / 2;
        line.setAttribute('d', `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
        line.setAttribute('class', 'temp-connection');
        line.id = 'temp-conn';
        canvasSvg.appendChild(line);
    }

    function removeTempConnection() {
        const temp = document.getElementById('temp-conn');
        if (temp) temp.remove();
    }

    // ===== CODE GENERATION =====
    function updateCode() {
        const codeEl = document.getElementById('generated-code');
        if (!codeEl) return;

        if (activeCodeFile === 'main') {
            codeEl.innerHTML = generateMainTf();
        } else if (activeCodeFile === 'variables') {
            codeEl.innerHTML = generateVariablesTf();
        } else if (activeCodeFile === 'outputs') {
            codeEl.innerHTML = generateOutputsTf();
        }

        updateCostEstimate();
        updateVariablesPanel();
        updateOutputsPanel();
        updateIssues();
        // Add copy button to code editor
        if (typeof addCopyButton === 'function') addCopyButton();
    }

    function generateMainTf() {
        let code = `<span class="c-comment"># CloudForge - Auto-generated Terraform</span>\n`;
        code += `<span class="c-comment"># Generated ${canvasNodes.length} resource(s)</span>\n\n`;
        code += `<span class="c-keyword">terraform</span> {\n`;
        code += `  <span class="c-key">required_providers</span> {\n`;
        code += `    <span class="c-key">aws</span> = {\n`;
        code += `      <span class="c-key">source</span>  = <span class="c-string">"hashicorp/aws"</span>\n`;
        code += `      <span class="c-key">version</span> = <span class="c-string">"~> 6.47.0"</span>\n`;
        code += `    }\n  }\n}\n\n`;
        code += `<span class="c-keyword">provider</span> <span class="c-string">"aws"</span> {\n`;
        code += `  <span class="c-key">region</span> = <span class="c-value">var.aws_region</span>\n}\n`;

        canvasNodes.forEach(node => {
            code += `\n<div class="code-block" data-node-id="${node.id}" id="code-${node.id}">`;
            code += `<span class="c-keyword">resource</span> <span class="c-string">"${node.resource.tf}"</span> <span class="c-string">"${node.name.replace(/-/g, '_')}"</span> {\n`;
            code += generateTfBody(node);
            code += `}</div>\n`;
        });

        return code;
    }

    function generateVariablesTf() {
        const K = (k) => `<span class="c-key">${k}</span>`;
        const S = (s) => `<span class="c-string">"${s}"</span>`;
        const V = (v) => `<span class="c-value">${v}</span>`;
        const C = (c) => `<span class="c-comment"># ${c}</span>`;

        let code = `${C('=== CloudForge Auto-generated Variables ===')}\n${C(`Generated for ${canvasNodes.length} resource(s)`)}\n\n`;

        // Core variables always present
        code += `${C('--- Core Configuration ---')}\n\n`;
        code += `<span class="c-keyword">variable</span> ${S('aws_region')} {\n  ${K('description')} = ${S('AWS region for all resources')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('us-east-1')}\n}\n`;
        code += `\n<span class="c-keyword">variable</span> ${S('environment')} {\n  ${K('description')} = ${S('Deployment environment (development, staging, production)')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('development')}\n\n  ${K('validation')} {\n    ${K('condition')}     = ${V('contains(["development", "staging", "production"], var.environment)')}\n    ${K('error_message')} = ${S('Environment must be development, staging, or production.')}\n  }\n}\n`;
        code += `\n<span class="c-keyword">variable</span> ${S('project_name')} {\n  ${K('description')} = ${S('Project name used for resource naming and tagging')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('cloudforge')}\n}\n`;

        // VPC variables
        if (canvasNodes.some(n => n.resource.id === 'vpc')) {
            code += `\n${C('--- Networking ---')}\n\n`;
            code += `<span class="c-keyword">variable</span> ${S('vpc_cidr')} {\n  ${K('description')} = ${S('CIDR block for the VPC')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('10.0.0.0/16')}\n}\n`;
        }

        // EC2 variables
        const hasEc2 = canvasNodes.some(n => n.resource.id === 'ec2');
        if (hasEc2) {
            code += `\n${C('--- Compute ---')}\n\n`;
            code += `<span class="c-keyword">variable</span> ${S('instance_type')} {\n  ${K('description')} = ${S('EC2 instance type')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('t3.large')}\n}\n`;
        }

        // RDS variables
        const hasRds = canvasNodes.some(n => n.resource.id === 'rds');
        if (hasRds) {
            code += `\n${C('--- Database ---')}\n\n`;
            code += `<span class="c-keyword">variable</span> ${S('db_instance_class')} {\n  ${K('description')} = ${S('RDS instance class')}\n  ${K('type')}        = ${V('string')}\n  ${K('default')}     = ${S('db.r6g.large')}\n}\n`;
            code += `\n<span class="c-keyword">variable</span> ${S('db_username')} {\n  ${K('description')} = ${S('Database master username')}\n  ${K('type')}        = ${V('string')}\n  ${K('sensitive')}   = ${V('true')}\n}\n`;
            code += `\n<span class="c-keyword">variable</span> ${S('db_password')} {\n  ${K('description')} = ${S('Database master password')}\n  ${K('type')}        = ${V('string')}\n  ${K('sensitive')}   = ${V('true')}\n}\n`;
        }

        return code;
    }

    function generateOutputsTf() {
        let code = `<span class="c-comment"># CloudForge - Auto-generated Outputs</span>\n`;

        if (canvasNodes.length === 0) {
            code += `\n<span class="c-comment"># Add resources to generate outputs</span>\n`;
            return code;
        }

        canvasNodes.forEach(node => {
            const safeName = node.name.replace(/-/g, '_');
            code += `\n<span class="c-keyword">output</span> <span class="c-string">"${safeName}_id"</span> {\n`;
            code += `  <span class="c-key">description</span> = <span class="c-string">"ID of ${node.resource.label} ${node.name}"</span>\n`;
            code += `  <span class="c-key">value</span>       = <span class="c-value">${node.resource.tf}.${safeName}.id</span>\n}\n`;
        });

        return code;
    }

    function generateTfBody(node) {
        const r = node.resource;
        const n = node.name.replace(/-/g, '_');
        const K = (k) => `<span class="c-key">${k}</span>`;
        const S = (s) => `<span class="c-string">"${s}"</span>`;
        const V = (v) => `<span class="c-value">${v}</span>`;
        const C = (c) => `<span class="c-comment"># ${c}</span>`;
        const tags = `\n  ${K('tags')} = {\n    ${K('Name')}        = ${S(node.name)}\n    ${K('Environment')} = ${V('var.environment')}\n    ${K('Project')}     = ${V('var.project_name')}\n    ${K('ManagedBy')}   = ${S('CloudForge')}\n  }\n`;

        // Check what other resources exist for cross-references
        const hasVpc = canvasNodes.some(nd => nd.resource.id === 'vpc');
        const vpcRef = hasVpc ? canvasNodes.find(nd => nd.resource.id === 'vpc') : null;
        const hasSg = canvasNodes.some(nd => nd.resource.id === 'sg');
        const sgRef = hasSg ? canvasNodes.find(nd => nd.resource.id === 'sg') : null;
        const hasSubnet = canvasNodes.some(nd => nd.resource.id === 'subnet');

        switch (r.id) {
            case 'vpc':
                return `  ${K('cidr_block')}           = ${V('var.vpc_cidr')}\n  ${K('enable_dns_support')}   = ${V('true')}\n  ${K('enable_dns_hostnames')} = ${V('true')}\n${tags}`;

            case 'subnet':
                return `  ${vpcRef ? `${K('vpc_id')}            = ${V(`aws_vpc.${vpcRef.name.replace(/-/g,'_')}.id`)}\n` : ''}  ${K('cidr_block')}        = ${V('cidrsubnet(var.vpc_cidr, 8, ' + Math.floor(Math.random()*10) + ')')}\n  ${K('availability_zone')} = ${S('${var.aws_region}a')}\n  ${K('map_public_ip_on_launch')} = ${V('true')}\n${tags}`;

            case 'ec2':
                return `  ${K('ami')}                    = ${V('data.aws_ami.ubuntu.id')}\n  ${K('instance_type')}          = ${V('var.instance_type')}\n  ${hasSg && sgRef ? `${K('vpc_security_group_ids')} = [${V(`aws_security_group.${sgRef.name.replace(/-/g,'_')}.id`)}]\n` : ''}  ${hasSubnet ? `${K('subnet_id')}              = ${V(`aws_subnet.${(canvasNodes.find(nd=>nd.resource.id==='subnet')?.name||'main').replace(/-/g,'_')}.id`)}\n` : ''}\n  ${K('root_block_device')} {\n    ${K('volume_type')}           = ${S('gp3')}\n    ${K('volume_size')}           = ${V('30')}\n    ${K('encrypted')}             = ${V('true')}\n    ${K('delete_on_termination')} = ${V('true')}\n  }\n\n  ${K('metadata_options')} {\n    ${K('http_endpoint')} = ${S('enabled')}\n    ${K('http_tokens')}   = ${S('required')}\n  }\n${tags}`;

            case 'rds':
                return `  ${K('identifier')}          = ${S(node.name)}\n  ${K('engine')}              = ${S('postgres')}\n  ${K('engine_version')}      = ${S('16.4')}\n  ${K('instance_class')}      = ${V('var.db_instance_class')}\n  ${K('allocated_storage')}   = ${V('100')}\n  ${K('max_allocated_storage')} = ${V('500')}\n\n  ${K('db_name')}  = ${S('app_database')}\n  ${K('username')} = ${V('var.db_username')}\n  ${K('password')} = ${V('var.db_password')}\n\n  ${K('multi_az')}               = ${V('var.environment == "production" ? true : false')}\n  ${K('storage_encrypted')}      = ${V('true')}\n  ${K('deletion_protection')}    = ${V('var.environment == "production" ? true : false')}\n  ${K('backup_retention_period')} = ${V('7')}\n  ${K('skip_final_snapshot')}    = ${V('var.environment != "production"')}\n  ${K('final_snapshot_identifier')} = ${S(`${node.name}-final-snapshot`)}\n\n  ${hasSg && sgRef ? `${K('vpc_security_group_ids')} = [${V(`aws_security_group.${sgRef.name.replace(/-/g,'_')}.id`)}]\n` : ''}${tags}`;

            case 's3':
                return `  ${K('bucket')}        = ${S(`\${var.project_name}-${node.name}-\${var.environment}`)}\n  ${K('force_destroy')} = ${V('var.environment != "production"')}\n${tags}}\n\n${C(`Enable versioning for ${node.name}`)}\n<span class="c-keyword">resource</span> ${S('aws_s3_bucket_versioning')} ${S(`${n}_versioning`)} {\n  ${K('bucket')} = ${V(`aws_s3_bucket.${n}.id`)}\n\n  ${K('versioning_configuration')} {\n    ${K('status')} = ${S('Enabled')}\n  }\n}\n\n${C('Block all public access')}\n<span class="c-keyword">resource</span> ${S('aws_s3_bucket_public_access_block')} ${S(`${n}_public_access`)} {\n  ${K('bucket')} = ${V(`aws_s3_bucket.${n}.id`)}\n\n  ${K('block_public_acls')}       = ${V('true')}\n  ${K('block_public_policy')}     = ${V('true')}\n  ${K('ignore_public_acls')}      = ${V('true')}\n  ${K('restrict_public_buckets')} = ${V('true')}\n}\n\n${C('Enable server-side encryption')}\n<span class="c-keyword">resource</span> ${S('aws_s3_bucket_server_side_encryption_configuration')} ${S(`${n}_encryption`)} {\n  ${K('bucket')} = ${V(`aws_s3_bucket.${n}.id`)}\n\n  ${K('rule')} {\n    ${K('apply_server_side_encryption_by_default')} {\n      ${K('sse_algorithm')} = ${S('aws:kms')}\n    }\n    ${K('bucket_key_enabled')} = ${V('true')}\n  }\n`;

            case 'alb':
                return `  ${K('name')}               = ${S(node.name)}\n  ${K('internal')}           = ${V('false')}\n  ${K('load_balancer_type')} = ${S('application')}\n  ${K('security_groups')}    = [${hasSg && sgRef ? V(`aws_security_group.${sgRef.name.replace(/-/g,'_')}.id`) : ''}]\n  ${hasSubnet ? `${K('subnets')}            = ${V('var.public_subnet_ids')}\n` : ''}\n  ${K('enable_deletion_protection')} = ${V('var.environment == "production"')}\n\n  ${K('access_logs')} {\n    ${K('bucket')}  = ${V('var.lb_access_logs_bucket')}\n    ${K('prefix')}  = ${S(node.name)}\n    ${K('enabled')} = ${V('true')}\n  }\n${tags}`;

            case 'lambda':
                return `  ${K('function_name')} = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('runtime')}       = ${S('nodejs20.x')}\n  ${K('handler')}       = ${S('index.handler')}\n  ${K('memory_size')}   = ${V('256')}\n  ${K('timeout')}       = ${V('30')}\n  ${K('architectures')} = [${S('arm64')}]\n\n  ${K('filename')}         = ${S('lambda.zip')}\n  ${K('source_code_hash')} = ${V('filebase64sha256("lambda.zip")')}\n\n  ${K('environment')} {\n    ${K('variables')} = {\n      ${K('ENVIRONMENT')} = ${V('var.environment')}\n      ${K('LOG_LEVEL')}   = ${S('info')}\n    }\n  }\n\n  ${K('tracing_config')} {\n    ${K('mode')} = ${S('Active')}\n  }\n${tags}`;

            case 'sg':
                return `  ${K('name')}        = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('description')} = ${S(`Security group for ${node.name} - Managed by CloudForge`)}\n  ${vpcRef ? `${K('vpc_id')}      = ${V(`aws_vpc.${vpcRef.name.replace(/-/g,'_')}.id`)}\n` : ''}\n  ${K('ingress')} {\n    ${K('description')} = ${S('HTTPS')}\n    ${K('from_port')}   = ${V('443')}\n    ${K('to_port')}     = ${V('443')}\n    ${K('protocol')}    = ${S('tcp')}\n    ${K('cidr_blocks')} = [${S('0.0.0.0/0')}]\n  }\n\n  ${K('ingress')} {\n    ${K('description')} = ${S('HTTP')}\n    ${K('from_port')}   = ${V('80')}\n    ${K('to_port')}     = ${V('80')}\n    ${K('protocol')}    = ${S('tcp')}\n    ${K('cidr_blocks')} = [${S('0.0.0.0/0')}]\n  }\n\n  ${K('egress')} {\n    ${K('description')} = ${S('All outbound')}\n    ${K('from_port')}   = ${V('0')}\n    ${K('to_port')}     = ${V('0')}\n    ${K('protocol')}    = ${S('-1')}\n    ${K('cidr_blocks')} = [${S('0.0.0.0/0')}]\n  }\n${tags}`;

            case 'iam_role':
                return `  ${K('name')} = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('path')} = ${S('/')}\n\n  ${K('assume_role_policy')} = ${V('jsonencode')}({\n    ${K('Version')} = ${S('2012-10-17')}\n    ${K('Statement')} = [{\n      ${K('Sid')}       = ${S('AllowAssumeRole')}\n      ${K('Action')}    = ${S('sts:AssumeRole')}\n      ${K('Effect')}    = ${S('Allow')}\n      ${K('Principal')} = {\n        ${K('Service')} = ${S('ec2.amazonaws.com')}\n      }\n    }]\n  })\n\n  ${K('managed_policy_arns')} = [\n    ${S('arn:aws:iam::aws:policy/CloudWatchLogsFullAccess')}\n  ]\n${tags}`;

            case 'dynamodb':
                return `  ${K('name')}         = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('billing_mode')} = ${S('PAY_PER_REQUEST')}\n  ${K('hash_key')}     = ${S('id')}\n  ${K('range_key')}    = ${S('sort_key')}\n\n  ${K('attribute')} {\n    ${K('name')} = ${S('id')}\n    ${K('type')} = ${S('S')}\n  }\n\n  ${K('attribute')} {\n    ${K('name')} = ${S('sort_key')}\n    ${K('type')} = ${S('S')}\n  }\n\n  ${K('point_in_time_recovery')} {\n    ${K('enabled')} = ${V('true')}\n  }\n\n  ${K('server_side_encryption')} {\n    ${K('enabled')} = ${V('true')}\n  }\n${tags}`;

            case 'cloudfront':
                return `  ${K('enabled')}             = ${V('true')}\n  ${K('is_ipv6_enabled')}     = ${V('true')}\n  ${K('default_root_object')} = ${S('index.html')}\n  ${K('price_class')}         = ${S('PriceClass_100')}\n\n  ${K('default_cache_behavior')} {\n    ${K('allowed_methods')}  = [${S('GET')}, ${S('HEAD')}, ${S('OPTIONS')}]\n    ${K('cached_methods')}   = [${S('GET')}, ${S('HEAD')}]\n    ${K('target_origin_id')} = ${S('S3Origin')}\n\n    ${K('forwarded_values')} {\n      ${K('query_string')} = ${V('false')}\n      ${K('cookies')} {\n        ${K('forward')} = ${S('none')}\n      }\n    }\n\n    ${K('viewer_protocol_policy')} = ${S('redirect-to-https')}\n    ${K('min_ttl')}                = ${V('0')}\n    ${K('default_ttl')}            = ${V('3600')}\n    ${K('max_ttl')}                = ${V('86400')}\n    ${K('compress')}               = ${V('true')}\n  }\n\n  ${K('restrictions')} {\n    ${K('geo_restriction')} {\n      ${K('restriction_type')} = ${S('none')}\n    }\n  }\n\n  ${K('viewer_certificate')} {\n    ${K('cloudfront_default_certificate')} = ${V('true')}\n  }\n${tags}`;

            case 'ecs':
                return `  ${K('name')} = ${S(`\${var.project_name}-${node.name}`)}\n\n  ${K('setting')} {\n    ${K('name')}  = ${S('containerInsights')}\n    ${K('value')} = ${S('enabled')}\n  }\n\n  ${K('configuration')} {\n    ${K('execute_command_configuration')} {\n      ${K('logging')} = ${S('OVERRIDE')}\n\n      ${K('log_configuration')} {\n        ${K('cloud_watch_log_group_name')} = ${S(`/ecs/\${var.project_name}`)}\n      }\n    }\n  }\n${tags}`;

            case 'natgw':
                return `  ${K('allocation_id')} = ${V(`aws_eip.${n}_eip.id`)}\n  ${hasSubnet ? `${K('subnet_id')}     = ${V(`aws_subnet.${(canvasNodes.find(nd=>nd.resource.id==='subnet')?.name||'public').replace(/-/g,'_')}.id`)}\n` : ''}\n  ${K('depends_on')} = [${V('aws_internet_gateway.main')}]\n${tags}`;

            case 'kms':
                return `  ${K('description')}             = ${S(`KMS key for ${node.name}`)}\n  ${K('deletion_window_in_days')} = ${V('7')}\n  ${K('enable_key_rotation')}     = ${V('true')}\n  ${K('is_enabled')}              = ${V('true')}\n\n  ${K('policy')} = ${V('data.aws_iam_policy_document.kms_policy.json')}\n${tags}`;

            case 'apigateway':
                return `  ${K('name')}        = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('description')} = ${S(`REST API for ${node.name} - Managed by CloudForge`)}\n\n  ${K('endpoint_configuration')} {\n    ${K('types')} = [${S('REGIONAL')}]\n  }\n${tags}`;

            case 'autoscaling':
                return `  ${K('name')}                = ${S(`\${var.project_name}-${node.name}`)}\n  ${K('min_size')}            = ${V('2')}\n  ${K('max_size')}            = ${V('10')}\n  ${K('desired_capacity')}    = ${V('2')}\n  ${K('health_check_type')}   = ${S('ELB')}\n  ${K('health_check_grace_period')} = ${V('300')}\n  ${K('force_delete')}        = ${V('true')}\n\n  ${K('launch_template')} {\n    ${K('id')}      = ${V('aws_launch_template.main.id')}\n    ${K('version')} = ${S('$Latest')}\n  }\n\n  ${K('tag')} {\n    ${K('key')}                 = ${S('Name')}\n    ${K('value')}               = ${S(node.name)}\n    ${K('propagate_at_launch')} = ${V('true')}\n  }\n`;

            case 'elasticache':
                return `  ${K('cluster_id')}           = ${S(node.name)}\n  ${K('engine')}               = ${S('redis')}\n  ${K('engine_version')}       = ${S('7.0')}\n  ${K('node_type')}            = ${S('cache.r6g.large')}\n  ${K('num_cache_nodes')}      = ${V('1')}\n  ${K('port')}                 = ${V('6379')}\n  ${K('parameter_group_name')} = ${S('default.redis7')}\n\n  ${K('snapshot_retention_limit')} = ${V('5')}\n  ${K('at_rest_encryption_enabled')} = ${V('true')}\n  ${K('transit_encryption_enabled')} = ${V('true')}\n${tags}`;

            default:
                return `  ${C('Configure ' + r.label + ' settings')}\n${tags}`;
        }
    }

    function highlightNodeCode(nodeId) {
        document.querySelectorAll('.code-block.highlighted').forEach(b => b.classList.remove('highlighted'));
        const codeBlock = document.getElementById(`code-${nodeId}`);
        if (codeBlock) {
            codeBlock.classList.add('highlighted');
            codeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Code file tabs
    document.querySelectorAll('.code-file-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.code-file-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCodeFile = tab.dataset.file;
            updateCode();
        });
    });

    // ===== ISSUES CHECK =====
    function updateIssues() {
        const list = document.getElementById('issues-list');
        if (!list) return;
        const issues = [];

        const hasPublicS3 = canvasNodes.some(n => n.resource.id === 's3');
        const hasSG = canvasNodes.some(n => n.resource.id === 'sg');
        const hasEC2 = canvasNodes.some(n => n.resource.id === 'ec2');
        const hasRDS = canvasNodes.some(n => n.resource.id === 'rds');

        if (hasEC2 && !hasSG) issues.push({ type: 'warn', text: 'EC2 instance without Security Group', resource: 'Consider adding a security group for network protection.' });
        if (hasRDS && !canvasNodes.some(n => n.resource.id === 'vpc')) issues.push({ type: 'warn', text: 'RDS without VPC', resource: 'Database should be placed in a VPC for network isolation.' });
        if (hasPublicS3) issues.push({ type: 'info', text: 'S3 bucket detected', resource: 'Ensure bucket policy restricts public access.' });

        if (issues.length === 0) {
            list.innerHTML = `<div class="issues-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="issues-icon-ok"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><h4>No issues found</h4><p>Your infrastructure code passes all checks.</p></div>`;
        } else {
            list.innerHTML = issues.map(i => `<div class="issue-item"><div class="issue-icon ${i.type}">${i.type === 'warn' ? '!' : 'i'}</div><div class="issue-text"><strong>${i.text}</strong><div class="issue-resource">${i.resource}</div></div></div>`).join('');
        }
    }

    // ===== VARIABLES & OUTPUTS PANELS =====
    function updateVariablesPanel() {
        const list = document.getElementById('var-list');
        if (!list) return;
        const vars = [{ name: 'aws_region', type: 'string', default: 'us-east-1' }, { name: 'environment', type: 'string', default: 'development' }, { name: 'project_name', type: 'string', default: 'cloudforge' }];
        if (canvasNodes.some(n => n.resource.id === 'ec2')) vars.push({ name: 'instance_type', type: 'string', default: 't3.large' });
        if (canvasNodes.some(n => n.resource.id === 'rds')) vars.push({ name: 'db_instance_class', type: 'string', default: 'db.r6g.large' });
        list.innerHTML = vars.map(v => `<div class="var-item"><div class="var-name">var.${v.name}</div><div class="var-type">${v.type} = "${v.default}"</div></div>`).join('');
    }

    function updateOutputsPanel() {
        const list = document.getElementById('output-list');
        if (!list) return;
        if (canvasNodes.length === 0) { list.innerHTML = '<div class="locals-empty"><p>Add resources to auto-generate outputs.</p></div>'; return; }
        list.innerHTML = canvasNodes.map(n => `<div class="output-item"><div class="output-name">${n.name.replace(/-/g, '_')}_id</div></div>`).join('');
    }

    // ===== COST ESTIMATION =====
    function updateCostEstimate() {
        const costBar = document.getElementById('cost-bar');
        if (canvasNodes.length === 0) { costBar.style.display = 'none'; return; }
        let total = 0;
        canvasNodes.forEach(n => { total += (costMap[n.resource.id] || 0); });
        document.getElementById('cost-value').textContent = `$${total.toFixed(2)}/mo`;
        document.getElementById('cost-detail').textContent = `${canvasNodes.length} resources`;
        costBar.style.display = 'flex';
    }

    // ===== STATUS BAR =====
    function updateStatusBar() {
        document.getElementById('status-nodes').textContent = `${canvasNodes.length} resource${canvasNodes.length !== 1 ? 's' : ''}`;
        document.getElementById('status-connections').textContent = `${connections.length} connection${connections.length !== 1 ? 's' : ''}`;
        let total = 0;
        canvasNodes.forEach(n => { total += (costMap[n.resource.id] || 0); });
        document.getElementById('status-cost').textContent = `$${total.toFixed(2)}/mo`;
    }

    // ===== MINIMAP =====
    function updateMinimap() {
        const canvas = document.getElementById('minimap-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (canvasNodes.length === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        canvasNodes.forEach(n => {
            minX = Math.min(minX, n.x);
            minY = Math.min(minY, n.y);
            maxX = Math.max(maxX, n.x + 170);
            maxY = Math.max(maxY, n.y + 80);
        });

        const padding = 40;
        const rangeX = (maxX - minX + padding * 2) || 1;
        const rangeY = (maxY - minY + padding * 2) || 1;
        const scaleX = canvas.width / rangeX;
        const scaleY = canvas.height / rangeY;
        const scale = Math.min(scaleX, scaleY);

        canvasNodes.forEach(n => {
            const x = (n.x - minX + padding) * scale;
            const y = (n.y - minY + padding) * scale;
            ctx.fillStyle = n.color;
            ctx.fillRect(x, y, Math.max(8, 170 * scale), Math.max(5, 60 * scale));
        });
    }

    // ===== CANVAS HELPERS =====
    function hideCanvasEmpty() {
        const empty = document.getElementById('canvas-empty');
        if (empty) empty.style.display = 'none';
    }

    function showCanvasEmpty() {
        const empty = document.getElementById('canvas-empty');
        if (empty) empty.style.display = '';
    }

    // ===== ZOOM CONTROLS =====
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        zoomLevel = Math.min(2, zoomLevel + 0.1);
        applyCanvasTransform();
        document.getElementById('zoom-level').textContent = Math.round(zoomLevel * 100) + '%';
    });

    document.getElementById('zoom-out')?.addEventListener('click', () => {
        zoomLevel = Math.max(0.3, zoomLevel - 0.1);
        applyCanvasTransform();
        document.getElementById('zoom-level').textContent = Math.round(zoomLevel * 100) + '%';
    });

    document.getElementById('zoom-fit')?.addEventListener('click', () => {
        zoomLevel = 1;
        panOffset = { x: 0, y: 0 };
        applyCanvasTransform();
        document.getElementById('zoom-level').textContent = '100%';
    });

    // ===== SNAP TO GRID =====
    document.getElementById('snap-grid-btn')?.addEventListener('click', function () {
        snapToGrid = !snapToGrid;
        this.classList.toggle('active', snapToGrid);
        showToast(snapToGrid ? 'Grid snap enabled' : 'Grid snap disabled', 'info');
    });

    // ===== CONTEXT MENU =====
    function showContextMenu(x, y) {
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('active');
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) contextMenu.classList.remove('active');
    });

    contextMenu.querySelectorAll('.ctx-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            contextMenu.classList.remove('active');
            if (!contextNodeId) return;
            switch (action) {
                case 'properties': openPropertiesPanel(contextNodeId); break;
                case 'duplicate': duplicateNode(contextNodeId); break;
                case 'delete': saveState(); deleteNode(contextNodeId); break;
                case 'connect':
                    isConnecting = true;
                    connectionStart = { nodeId: contextNodeId, port: 'right' };
                    canvasContainer.classList.add('connecting');
                    showToast('Click on another node port to connect', 'info');
                    break;
                case 'bringfront':
                    const el = document.getElementById(contextNodeId);
                    if (el) el.style.zIndex = 100;
                    break;
                case 'sendback':
                    const el2 = document.getElementById(contextNodeId);
                    if (el2) el2.style.zIndex = 2;
                    break;
            }
        });
    });

    // ===== PROPERTIES PANEL =====
    const propsPanel = document.getElementById('properties-panel');
    const propsBody = document.getElementById('props-body');
    const propsTitle = document.getElementById('props-title');

    function openPropertiesPanel(nodeId) {
        const node = canvasNodes.find(n => n.id === nodeId);
        if (!node) return;
        propsTitle.textContent = `${node.resource.label} Properties`;
        const cost = costMap[node.resource.id] || 0;

        propsBody.innerHTML = `
            <div class="prop-cost"><strong>$${cost.toFixed(2)}/mo</strong> estimated</div>
            <div class="prop-section">
                <div class="prop-section-title">General</div>
                <div class="prop-row"><label>Resource Name</label><input type="text" value="${node.name}" id="prop-name"></div>
                <div class="prop-row"><label>Type</label><input type="text" value="${node.resource.tf}" readonly></div>
                <div class="prop-row"><label>Provider</label><input type="text" value="AWS" readonly></div>
            </div>
            <div class="prop-section">
                <div class="prop-section-title">Configuration</div>
                ${getPropsForResource(node)}
            </div>
            <div class="prop-section">
                <div class="prop-section-title">Tags</div>
                <div class="prop-tags">
                    <span class="prop-tag">Name: ${node.name}</span>
                    <span class="prop-tag">ManagedBy: CloudForge</span>
                    <span class="prop-tag">Env: Development</span>
                </div>
            </div>
            <div class="prop-actions">
                <button class="btn-prop-save" id="prop-save-btn">Save Changes</button>
                <button class="btn-prop-delete" id="prop-delete-btn">Delete</button>
            </div>
        `;

        document.getElementById('prop-save-btn')?.addEventListener('click', () => {
            const newName = document.getElementById('prop-name')?.value;
            if (newName && newName !== node.name) {
                saveState();
                node.name = newName;
                const el = document.getElementById(node.id);
                if (el) el.querySelector('.node-name').textContent = newName;
                updateCode();
                saveToLocalStorage();
            }
            propsPanel.classList.remove('active');
            showToast('Properties saved', 'success');
        });

        document.getElementById('prop-delete-btn')?.addEventListener('click', () => {
            propsPanel.classList.remove('active');
            saveState();
            deleteNode(nodeId);
        });

        propsPanel.classList.add('active');
    }

    function getPropsForResource(node) {
        switch (node.resource.id) {
            case 'ec2': return `<div class="prop-row"><label>Instance Type</label><select><option selected>t3.large</option><option>t3.xlarge</option><option>m5.large</option><option>c5.xlarge</option></select></div><div class="prop-row"><label>AMI</label><input type="text" value="ami-0abcdef1234567890"></div>`;
            case 'rds': return `<div class="prop-row"><label>Engine</label><select><option selected>PostgreSQL</option><option>MySQL</option><option>MariaDB</option></select></div><div class="prop-row"><label>Instance Class</label><select><option selected>db.r6g.large</option><option>db.r6g.xlarge</option><option>db.t3.medium</option></select></div><div class="prop-row"><label>Storage (GB)</label><input type="number" value="100"></div><div class="prop-row"><label>Multi-AZ</label><select><option selected>Yes</option><option>No</option></select></div>`;
            case 'vpc': return `<div class="prop-row"><label>CIDR Block</label><input type="text" value="10.0.0.0/16"></div><div class="prop-row"><label>DNS Hostnames</label><select><option selected>Enabled</option><option>Disabled</option></select></div>`;
            case 's3': return `<div class="prop-row"><label>Bucket Name</label><input type="text" value="${node.name}"></div><div class="prop-row"><label>Versioning</label><select><option selected>Enabled</option><option>Disabled</option></select></div><div class="prop-row"><label>Access</label><select><option selected>Private</option><option>Public Read</option></select></div>`;
            case 'alb': return `<div class="prop-row"><label>Scheme</label><select><option selected>Internet-facing</option><option>Internal</option></select></div><div class="prop-row"><label>Type</label><input type="text" value="application" readonly></div>`;
            case 'lambda': return `<div class="prop-row"><label>Runtime</label><select><option selected>nodejs20.x</option><option>python3.12</option><option>java21</option></select></div><div class="prop-row"><label>Memory (MB)</label><input type="number" value="256"></div><div class="prop-row"><label>Timeout (s)</label><input type="number" value="30"></div>`;
            default: return `<div class="prop-row"><label>Detail</label><input type="text" value="${node.detail}"></div>`;
        }
    }

    document.getElementById('props-close')?.addEventListener('click', () => propsPanel.classList.remove('active'));

    // ===== PAGE NAVIGATION =====
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    function navigateTo(page) {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`.sidebar-link[data-page="${page}"]`)?.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`)?.classList.add('active');
    }

    function openDesigner() {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-designer').classList.add('active');
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        setTimeout(() => { drawConnections(); updateMinimap(); }, 100);
    }

    // ===== TAB SWITCHING =====
    document.querySelectorAll('.res-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.res-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.res-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
        });
    });

    document.querySelectorAll('.cp-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.cp-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.cp-section').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`cp-${tab.dataset.cp}`)?.classList.add('active');
        });
    });

    codeToggle?.addEventListener('click', () => {
        codeToggle.classList.toggle('active');
        codePanel.classList.toggle('hidden');
    });

    // ===== CREATE ARCHITECTURE =====
    const createModal = document.getElementById('create-modal');
    const createForm = document.getElementById('create-form');
    const createOptions = document.querySelector('.create-options');

    function openCreateModal() {
        createModal.classList.add('active');
        createForm.style.display = 'none';
        createOptions.style.display = '';
    }

    document.getElementById('create-arch-btn')?.addEventListener('click', openCreateModal);
    document.getElementById('create-arch-btn-2')?.addEventListener('click', openCreateModal);
    document.getElementById('new-arch-in-project')?.addEventListener('click', openCreateModal);
    document.getElementById('create-modal-close')?.addEventListener('click', () => createModal.classList.remove('active'));

    document.getElementById('opt-scratch')?.addEventListener('click', () => { createOptions.style.display = 'none'; createForm.style.display = ''; });
    document.getElementById('opt-template')?.addEventListener('click', () => { createModal.classList.remove('active'); navigateTo('templates'); });
    document.getElementById('opt-ai')?.addEventListener('click', () => { createModal.classList.remove('active'); openDesigner(); document.getElementById('ai-modal').classList.add('active'); });
    document.getElementById('create-back')?.addEventListener('click', () => { createForm.style.display = 'none'; createOptions.style.display = ''; });

    document.getElementById('create-confirm')?.addEventListener('click', () => {
        const name = document.getElementById('new-arch-name').value.trim();
        if (!name) { document.getElementById('new-arch-name').style.borderColor = '#ef4444'; return; }
        createModal.classList.remove('active');
        document.getElementById('arch-name-crumb').textContent = name;
        canvasNodes = [];
        connections = [];
        canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
        showCanvasEmpty();
        updateCode();
        updateStatusBar();
        openDesigner();
        showToast(`Architecture "${name}" created`, 'success');
    });

    // ===== AI MODAL =====
    const aiModal = document.getElementById('ai-modal');
    document.getElementById('ai-btn')?.addEventListener('click', () => aiModal.classList.add('active'));
    document.getElementById('empty-ai-btn')?.addEventListener('click', () => { openDesigner(); aiModal.classList.add('active'); });
    document.getElementById('ai-modal-close')?.addEventListener('click', () => aiModal.classList.remove('active'));

    document.querySelectorAll('.ai-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('ai-prompt').value = chip.dataset.prompt;
        });
    });

    document.getElementById('ai-generate')?.addEventListener('click', () => {
        const prompt = document.getElementById('ai-prompt').value.trim();
        if (!prompt) return;
        aiModal.classList.remove('active');
        showToast('Generating architecture...', 'info');

        setTimeout(() => {
            saveState();
            canvasNodes = [];
            connections = [];
            canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());

            const aiResources = [
                { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 40 },
                { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'public', tf: 'aws_subnet', catName: 'Network' }, x: 60, y: 180 },
                { resource: { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb', catName: 'Network' }, x: 300, y: 40 },
                { resource: { id: 'ec2', label: 'EC2', type: 'aws_instance', detail: 't3.large', tf: 'aws_instance', catName: 'Compute' }, x: 300, y: 180 },
                { resource: { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL', tf: 'aws_db_instance', catName: 'Database' }, x: 540, y: 40 },
                { resource: { id: 's3', label: 'S3', type: 'aws_s3_bucket', detail: 'private', tf: 'aws_s3_bucket', catName: 'Storage' }, x: 540, y: 180 },
                { resource: { id: 'sg', label: 'Sec Group', type: 'aws_security_group', detail: 'ingress/egress', tf: 'aws_security_group', catName: 'Security' }, x: 780, y: 110 },
            ];

            let delay = 0;
            aiResources.forEach(r => {
                setTimeout(() => addNodeToCanvas(r.resource, r.x, r.y), delay);
                delay += 250;
            });

            setTimeout(() => {
                // Auto-create connections
                const ids = canvasNodes.map(n => n.id);
                if (ids.length >= 2) {
                    for (let i = 0; i < ids.length - 1; i++) {
                        connections.push({
                            id: `conn-${connectionIdCounter++}`,
                            from: { nodeId: ids[i], port: 'right' },
                            to: { nodeId: ids[i + 1], port: 'left' }
                        });
                    }
                    drawConnections();
                    updateStatusBar();
                }
                showToast(`Architecture generated! ${aiResources.length} resources added.`, 'success');
                saveToLocalStorage();
            }, delay + 300);
        }, 800);
    });

    // ===== PLAN & APPLY =====
    function runPlan() {
        if (canvasNodes.length === 0) { showToast('Add resources to the canvas first', 'warning'); return; }

        document.querySelectorAll('.cp-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cp-section').forEach(c => c.classList.remove('active'));
        document.querySelector('.cp-tab[data-cp="deploy"]')?.classList.add('active');
        document.getElementById('cp-deploy')?.classList.add('active');
        if (codePanel.classList.contains('hidden')) codeToggle.click();

        const log = document.getElementById('deploy-log');
        log.innerHTML = '<div class="log-line info">Initializing Terraform...</div>';
        planComplete = false;
        document.getElementById('deploy-apply-btn').disabled = true;
        document.getElementById('apply-top-btn').disabled = true;

        const lines = [
            { text: 'Terraform v1.8.0', cls: 'info', delay: 400 },
            { text: 'Initializing provider plugins...', cls: 'info', delay: 800 },
            { text: '- Finding hashicorp/aws versions matching "~> 6.47.0"...', cls: 'info', delay: 1300 },
            { text: '- Installing hashicorp/aws v6.47.0...', cls: 'info', delay: 1800 },
            { text: '', cls: 'info', delay: 2200 },
            ...canvasNodes.map((n, i) => ({ text: `  + ${n.resource.tf}.${n.name.replace(/-/g, '_')} will be created`, cls: 'success', delay: 2400 + i * 200 })),
            { text: '', cls: 'info', delay: 2400 + canvasNodes.length * 200 + 200 },
            { text: `Plan: ${canvasNodes.length} to add, 0 to change, 0 to destroy.`, cls: 'success', delay: 2400 + canvasNodes.length * 200 + 400 },
        ];

        lines.forEach(line => {
            setTimeout(() => {
                log.innerHTML += `<div class="log-line ${line.cls}">${line.text}</div>`;
                log.scrollTop = log.scrollHeight;
            }, line.delay);
        });

        setTimeout(() => {
            planComplete = true;
            document.getElementById('deploy-apply-btn').disabled = false;
            document.getElementById('apply-top-btn').disabled = false;
            showToast(`Plan complete: ${canvasNodes.length} resources to add`, 'success');
        }, 2400 + canvasNodes.length * 200 + 600);
    }

    function runApply() {
        if (!planComplete) { showToast('Run Plan first', 'warning'); return; }
        const log = document.getElementById('deploy-log');
        log.innerHTML += '\n<div class="log-line info">Applying...</div>';
        document.getElementById('deploy-apply-btn').disabled = true;
        document.getElementById('apply-top-btn').disabled = true;

        let delay = 300;
        canvasNodes.forEach((n, i) => {
            setTimeout(() => {
                log.innerHTML += `<div class="log-line success">  ${n.resource.tf}.${n.name.replace(/-/g, '_')}: Creating...</div>`;
                log.scrollTop = log.scrollHeight;
            }, delay);
            delay += 400;
            setTimeout(() => {
                log.innerHTML += `<div class="log-line success">  ${n.resource.tf}.${n.name.replace(/-/g, '_')}: Creation complete after ${(Math.random() * 30 + 5).toFixed(0)}s</div>`;
                log.scrollTop = log.scrollHeight;
            }, delay);
            delay += 200;
        });

        setTimeout(() => {
            log.innerHTML += `\n<div class="log-line success">Apply complete! Resources: ${canvasNodes.length} added, 0 changed, 0 destroyed.</div>`;
            log.scrollTop = log.scrollHeight;
            showToast('Apply complete! Infrastructure deployed.', 'success');
            planComplete = false;
        }, delay + 300);
    }

    document.getElementById('plan-btn')?.addEventListener('click', runPlan);
    document.getElementById('deploy-plan-btn')?.addEventListener('click', runPlan);
    document.getElementById('deploy-apply-btn')?.addEventListener('click', runApply);
    document.getElementById('apply-top-btn')?.addEventListener('click', runApply);

    // ===== SELECT ALL / DELETE SELECTED =====
    document.getElementById('select-all-btn')?.addEventListener('click', () => {
        canvasNodes.forEach(n => selectedNodes.add(n.id));
        updateNodeSelectionVisuals();
        showToast(`${canvasNodes.length} resources selected`, 'info');
    });

    document.getElementById('delete-selected-btn')?.addEventListener('click', () => {
        if (selectedNodes.size === 0) return;
        saveState();
        [...selectedNodes].forEach(id => deleteNode(id));
        selectedNodes.clear();
    });

    // ===== HOME PAGE =====
    function renderHomeArchitectures() {
        const grid = document.getElementById('arch-grid');
        const archs = [
            { name: 'prod-web-app', desc: 'Production - 5 resources', nodes: ['#ff6b00', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'] },
            { name: 'staging-api', desc: 'Staging - 3 resources', nodes: ['#3b82f6', '#ff6b00', '#8b5cf6'] },
            { name: 'dev-microservice', desc: 'Development - 4 resources', nodes: ['#ff6b00', '#3b82f6', '#10b981', '#8b5cf6'] },
        ];

        grid.innerHTML = archs.map(a => `
            <div class="arch-card" data-arch-name="${a.name}">
                <div class="arch-card-preview">
                    <div class="mini-nodes">
                        ${a.nodes.map(c => `<div class="mini-node-dot" style="background:${c};"></div>`).join('')}
                    </div>
                </div>
                <div class="arch-card-body">
                    <h4>${a.name}</h4>
                    <p>${a.desc}</p>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.arch-card').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('arch-name-crumb').textContent = card.dataset.archName;
                openDesigner();
            });
        });
    }

    renderHomeArchitectures();

    // ===== TEMPLATES =====
    function renderTemplates() {
        const grid = document.getElementById('templates-grid');
        grid.innerHTML = templates.map(t => `
            <div class="template-card" data-filter="${t.filter}">
                <div class="template-card-icon">${t.icon}</div>
                <h4>${t.name}</h4>
                <p>${t.desc}</p>
                <div class="template-card-tags">
                    ${t.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const name = card.querySelector('h4').textContent;
                document.getElementById('arch-name-crumb').textContent = name;
                canvasNodes = [];
                connections = [];
                canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
                openDesigner();

                const templateResources = getTemplateResources(name);
                let delay = 0;
                templateResources.forEach(r => {
                    setTimeout(() => addNodeToCanvas(r.resource, r.x, r.y), delay);
                    delay += 200;
                });
                setTimeout(() => {
                    showToast(`Template "${name}" loaded`, 'success');
                    saveToLocalStorage();
                }, delay + 200);
            });
        });
    }

    renderTemplates();

    // ===== SIDEBAR TEMPLATE CATEGORIES =====
    const sidebarTemplateData = [
        {
            name: 'Web, API & Apps', templates: [
                { name: 'Web App + ALB + ASG', tags: ['EC2','ALB','ASG'], color: '#ff6b00', tplName: 'Web App with ALB & Auto Scaling' },
                { name: 'Serverless REST API', tags: ['Lambda','API GW','DynamoDB'], color: '#f59e0b', tplName: 'Serverless API' },
                { name: 'ECS Fargate App', tags: ['ECS','ALB','RDS'], color: '#3b82f6', tplName: 'Container Platform (ECS)' },
            ]
        },
        {
            name: 'Data & Storage', templates: [
                { name: 'S3 Data Lake', tags: ['S3','KMS','IAM'], color: '#10b981', tplName: 'Data Lake' },
                { name: 'RDS PostgreSQL', tags: ['RDS','VPC','SG'], color: '#8b5cf6', tplName: 'Secure VPC Network' },
                { name: 'DynamoDB Table', tags: ['DynamoDB'], color: '#f59e0b', tplName: 'Serverless API' },
            ]
        },
        {
            name: 'Events & Workflows', templates: [
                { name: 'Lambda + SQS', tags: ['Lambda','SQS'], color: '#ff6b00', tplName: 'Serverless API' },
                { name: 'EventBridge + Lambda', tags: ['Events','Lambda'], color: '#8b5cf6', tplName: 'Serverless API' },
            ]
        },
        {
            name: 'Infra & Resilience', templates: [
                { name: 'Multi-AZ VPC', tags: ['VPC','Subnet','NAT','SG'], color: '#3b82f6', tplName: 'Secure VPC Network' },
                { name: 'CloudFront + S3', tags: ['CloudFront','S3'], color: '#10b981', tplName: 'Data Lake' },
                { name: 'Auto Scaling Group', tags: ['ASG','ALB','EC2'], color: '#ff6b00', tplName: 'Web App with ALB & Auto Scaling' },
            ]
        },
        {
            name: 'Security & IAM', templates: [
                { name: 'IAM Roles + Policies', tags: ['IAM','KMS'], color: '#ef4444', tplName: 'Secure VPC Network' },
                { name: 'WAF + CloudFront', tags: ['WAF','CloudFront'], color: '#ef4444', tplName: 'Data Lake' },
            ]
        },
    ];

    function renderSidebarTemplates() {
        const container = document.getElementById('sidebar-template-categories');
        if (!container) return;
        container.innerHTML = '';

        sidebarTemplateData.forEach(cat => {
            // Category header
            const catDiv = document.createElement('div');
            catDiv.className = 'template-cat';
            catDiv.innerHTML = `<span>${cat.name}</span><svg class="cat-arrow" width="12" height="12" viewBox="0 0 12 12"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
            container.appendChild(catDiv);

            // Items container
            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'template-cat-items';
            cat.templates.forEach(tpl => {
                const item = document.createElement('div');
                item.className = 'sidebar-template-item';
                item.innerHTML = `
                    <div class="sti-icon" style="background:${tpl.color}">${tpl.name.substring(0,2).toUpperCase()}</div>
                    <div class="sti-info">
                        <strong>${tpl.name}</strong>
                        <div class="sti-tags">${tpl.tags.map(t => `<span class="sti-tag">${t}</span>`).join('')}</div>
                    </div>
                `;
                item.addEventListener('click', () => {
                    // Load template onto canvas
                    document.getElementById('arch-name-crumb').textContent = tpl.name;
                    canvasNodes = [];
                    connections = [];
                    canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
                    canvasArea.querySelectorAll('.canvas-design-node').forEach(n => n.remove());
                    openDesigner();

                    const resources = getTemplateResources(tpl.tplName);
                    let delay = 0;
                    resources.forEach(r => {
                        setTimeout(() => addNodeToCanvas(r.resource, r.x, r.y), delay);
                        delay += 200;
                    });
                    setTimeout(() => {
                        showToast(`Template "${tpl.name}" loaded with ${resources.length} resources`, 'success');
                        saveToLocalStorage();
                    }, delay + 200);
                });
                itemsDiv.appendChild(item);
            });
            container.appendChild(itemsDiv);

            // Toggle expand/collapse
            catDiv.addEventListener('click', () => {
                const wasExpanded = catDiv.classList.contains('expanded');
                // Close all others
                container.querySelectorAll('.template-cat').forEach(c => c.classList.remove('expanded'));
                container.querySelectorAll('.template-cat-items').forEach(i => i.style.display = 'none');
                // Toggle this one
                if (!wasExpanded) {
                    catDiv.classList.add('expanded');
                    itemsDiv.style.display = 'block';
                }
            });
        });
    }

    renderSidebarTemplates();

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.dataset.filter;
            document.querySelectorAll('.template-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.filter === filter) ? '' : 'none';
            });
        });
    });

    document.getElementById('empty-template-btn')?.addEventListener('click', () => navigateTo('templates'));

    function getTemplateResources(name) {
        if (name.includes('Web App')) return [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 30 },
            { resource: { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb', catName: 'Network' }, x: 300, y: 30 },
            { resource: { id: 'autoscaling', label: 'AutoScale', type: 'aws_autoscaling_group', detail: '2-10 instances', tf: 'aws_autoscaling_group', catName: 'Compute' }, x: 300, y: 160 },
            { resource: { id: 'ec2', label: 'EC2', type: 'aws_instance', detail: 't3.large', tf: 'aws_instance', catName: 'Compute' }, x: 540, y: 30 },
            { resource: { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL', tf: 'aws_db_instance', catName: 'Database' }, x: 540, y: 160 },
        ];
        if (name.includes('Serverless')) return [
            { resource: { id: 'apigateway', label: 'API GW', type: 'aws_api_gateway_rest_api', detail: 'REST', tf: 'aws_api_gateway_rest_api', catName: 'Network' }, x: 60, y: 80 },
            { resource: { id: 'lambda', label: 'Lambda', type: 'aws_lambda_function', detail: 'Node.js 20', tf: 'aws_lambda_function', catName: 'Compute' }, x: 300, y: 80 },
            { resource: { id: 'dynamodb', label: 'DynamoDB', type: 'aws_dynamodb_table', detail: 'on-demand', tf: 'aws_dynamodb_table', catName: 'Database' }, x: 540, y: 80 },
        ];
        if (name.includes('Container')) return [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 30 },
            { resource: { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb', catName: 'Network' }, x: 300, y: 30 },
            { resource: { id: 'ecs', label: 'ECS', type: 'aws_ecs_cluster', detail: 'Fargate', tf: 'aws_ecs_cluster', catName: 'Compute' }, x: 300, y: 160 },
            { resource: { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL', tf: 'aws_db_instance', catName: 'Database' }, x: 540, y: 100 },
        ];
        if (name.includes('VPC')) return [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 80 },
            { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'public', tf: 'aws_subnet', catName: 'Network' }, x: 300, y: 30 },
            { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'private', tf: 'aws_subnet', catName: 'Network' }, x: 300, y: 170 },
            { resource: { id: 'natgw', label: 'NAT GW', type: 'aws_nat_gateway', detail: 'elastic IP', tf: 'aws_nat_gateway', catName: 'Network' }, x: 540, y: 100 },
            { resource: { id: 'sg', label: 'Sec Group', type: 'aws_security_group', detail: 'ingress/egress', tf: 'aws_security_group', catName: 'Security' }, x: 540, y: 230 },
        ];
        return [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 80 },
            { resource: { id: 'ec2', label: 'EC2', type: 'aws_instance', detail: 't3.large', tf: 'aws_instance', catName: 'Compute' }, x: 300, y: 80 },
            { resource: { id: 's3', label: 'S3', type: 'aws_s3_bucket', detail: 'private', tf: 'aws_s3_bucket', catName: 'Storage' }, x: 540, y: 80 },
        ];
    }

    // ===== COMMAND PALETTE =====
    const cmdOverlay = document.getElementById('cmd-palette-overlay');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.getElementById('cmd-results');

    const cmdActions = [
        { icon: 'H', name: 'Go to Home', desc: 'Dashboard', action: () => navigateTo('home') },
        { icon: 'P', name: 'Go to Projects', desc: 'View projects', action: () => navigateTo('projects') },
        { icon: 'T', name: 'Go to Templates', desc: 'Browse templates', action: () => navigateTo('templates') },
        { icon: 'A', name: 'Go to Activity', desc: 'View activity log', action: () => navigateTo('activity') },
        { icon: 'S', name: 'Go to Settings', desc: 'Organization settings', action: () => navigateTo('settings') },
        { icon: '+', name: 'Create Architecture', desc: 'Start new', action: () => { cmdOverlay.classList.remove('active'); openCreateModal(); } },
        { icon: 'AI', name: 'AI Generate', desc: 'Generate with AI', action: () => { cmdOverlay.classList.remove('active'); openDesigner(); aiModal.classList.add('active'); } },
        { icon: 'D', name: 'Toggle Dark Mode', desc: 'Switch theme', action: () => { cmdOverlay.classList.remove('active'); toggleTheme(); } },
    ];

    function renderCmdResults(filter = '') {
        const filtered = filter ? cmdActions.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()) || a.desc.toLowerCase().includes(filter.toLowerCase())) : cmdActions;
        if (filtered.length === 0) { cmdResults.innerHTML = '<div class="notif-empty">No results found</div>'; return; }
        cmdResults.innerHTML = filtered.map((a, i) => `<div class="cmd-item" data-idx="${i}"><div class="cmd-item-icon">${a.icon}</div><div class="cmd-item-info"><strong>${a.name}</strong><span>${a.desc}</span></div></div>`).join('');

        cmdResults.querySelectorAll('.cmd-item').forEach((item, idx) => {
            item.addEventListener('click', () => {
                filtered[idx]?.action?.();
                cmdOverlay.classList.remove('active');
            });
        });
    }

    function openCmdPalette() {
        cmdOverlay.classList.add('active');
        cmdInput.value = '';
        renderCmdResults();
        setTimeout(() => cmdInput.focus(), 100);
    }

    document.getElementById('topbar-search')?.addEventListener('click', openCmdPalette);
    cmdInput?.addEventListener('input', () => renderCmdResults(cmdInput.value));

    // ===== NOTIFICATIONS =====
    const notifPanel = document.getElementById('notif-panel');
    const notifList = document.getElementById('notif-list');
    const notifications = [
        { type: 'success', msg: '<strong>prod-web-app</strong> deployed successfully', time: '2 hours ago' },
        { type: 'warning', msg: '<strong>dev-microservice</strong> drift detected', time: '1 day ago' },
        { type: 'info', msg: 'Your trial expires in <strong>30 days</strong>', time: '3 days ago' },
        { type: 'success', msg: 'Security scan passed &mdash; <strong>0 issues</strong>', time: '3 days ago' },
    ];

    function renderNotifications() {
        if (notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-empty">No notifications</div>';
            document.getElementById('notif-dot').style.display = 'none';
            return;
        }
        const icons = { success: '&#10003;', warning: '!', info: 'i' };
        notifList.innerHTML = notifications.map(n => `<div class="notif-item"><div class="notif-item-icon ${n.type}">${icons[n.type]}</div><div class="notif-item-body">${n.msg}<div class="notif-item-time">${n.time}</div></div></div>`).join('');
    }

    renderNotifications();

    document.getElementById('notif-btn')?.addEventListener('click', () => notifPanel.classList.toggle('active'));
    document.getElementById('notif-clear')?.addEventListener('click', () => { notifications.length = 0; renderNotifications(); });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notif-panel') && !e.target.closest('#notif-btn')) notifPanel.classList.remove('active');
    });

    // ===== EXPORT =====
    document.getElementById('export-btn')?.addEventListener('click', () => document.getElementById('export-modal').classList.add('active'));
    document.getElementById('export-modal-close')?.addEventListener('click', () => document.getElementById('export-modal').classList.remove('active'));

    document.getElementById('export-tf')?.addEventListener('click', () => {
        document.getElementById('export-modal').classList.remove('active');
        showToast('Terraform files downloaded', 'success');
    });

    document.getElementById('export-json')?.addEventListener('click', () => {
        document.getElementById('export-modal').classList.remove('active');
        const data = JSON.stringify({ resources: canvasNodes.map(n => ({ type: n.resource.tf, name: n.name, config: n.detail })), connections }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'architecture.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON blueprint exported', 'success');
    });

    document.getElementById('export-diagram')?.addEventListener('click', () => {
        document.getElementById('export-modal').classList.remove('active');
        showToast('Diagram exported as PNG', 'success');
    });

    document.getElementById('export-docs')?.addEventListener('click', () => {
        document.getElementById('export-modal').classList.remove('active');
        showToast('Documentation generated', 'success');
    });

    // ===== PROJECT DETAIL =====
    const projectData = {
        project1: {
            name: 'Project 1', icon: 'P1', color: '#6366f1', archCount: 3, envCount: 2,
            architectures: [
                { name: 'prod-web-app', env: 'Production', envClass: 'prod', resources: 5, colors: ['#ff6b00', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'], time: '2h ago' },
                { name: 'staging-api', env: 'Staging', envClass: 'staging', resources: 3, colors: ['#3b82f6', '#ff6b00', '#8b5cf6'], time: '5h ago' },
                { name: 'dev-microservice', env: 'Development', envClass: 'dev', resources: 4, colors: ['#ff6b00', '#3b82f6', '#10b981', '#8b5cf6'], time: '1d ago' },
            ]
        },
        project2: {
            name: 'Microservices Platform', icon: 'P2', color: '#8b5cf6', archCount: 7, envCount: 3,
            architectures: [
                { name: 'user-service', env: 'Production', envClass: 'prod', resources: 6, colors: ['#ff6b00', '#3b82f6', '#8b5cf6', '#10b981'], time: '3h ago' },
                { name: 'payment-gateway', env: 'Production', envClass: 'prod', resources: 8, colors: ['#ff6b00', '#3b82f6', '#8b5cf6', '#ef4444'], time: '6h ago' },
                { name: 'notification-service', env: 'Staging', envClass: 'staging', resources: 3, colors: ['#ff6b00', '#3b82f6', '#8b5cf6'], time: '1d ago' },
                { name: 'api-gateway', env: 'Production', envClass: 'prod', resources: 5, colors: ['#3b82f6', '#ff6b00', '#8b5cf6'], time: '1d ago' },
            ]
        }
    };

    document.querySelectorAll('.project-card[data-project]').forEach(card => {
        card.addEventListener('click', () => {
            const project = projectData[card.dataset.project];
            if (!project) return;
            document.getElementById('pd-icon').textContent = project.icon;
            document.getElementById('pd-icon').style.background = project.color;
            document.getElementById('pd-name').textContent = project.name;
            document.getElementById('pd-arch-count').textContent = project.archCount;
            document.getElementById('pd-env-count').textContent = project.envCount;
            document.getElementById('projects-title').textContent = project.name;

            const archList = document.getElementById('pd-arch-list');
            archList.innerHTML = project.architectures.map(a => `
                <div class="arch-list-item" data-arch-name="${a.name}">
                    <div class="arch-mini-preview">${a.colors.slice(0, 4).map(c => `<div class="dot" style="background:${c}"></div>`).join('')}</div>
                    <div class="arch-list-info"><h4>${a.name}</h4><p>${a.resources} resources</p></div>
                    <div class="arch-list-meta"><span class="env-badge ${a.envClass}">${a.env}</span><span class="arch-time">${a.time}</span></div>
                </div>
            `).join('');

            archList.querySelectorAll('.arch-list-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('arch-name-crumb').textContent = item.dataset.archName;
                    openDesigner();
                });
            });

            document.getElementById('project-list-view').style.display = 'none';
            document.getElementById('project-detail-view').style.display = '';

            document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.proj-tab[data-ptab="architectures"]').classList.add('active');
            document.querySelectorAll('.proj-tab-content').forEach(c => { c.style.display = 'none'; c.classList.remove('active'); });
            document.getElementById('ptab-architectures').style.display = '';
            document.getElementById('ptab-architectures').classList.add('active');
        });
    });

    document.getElementById('project-back')?.addEventListener('click', () => {
        document.getElementById('project-list-view').style.display = '';
        document.getElementById('project-detail-view').style.display = 'none';
        document.getElementById('projects-title').textContent = 'Projects';
    });

    document.querySelectorAll('.proj-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.proj-tab-content').forEach(c => { c.style.display = 'none'; c.classList.remove('active'); });
            tab.classList.add('active');
            const target = document.getElementById(`ptab-${tab.dataset.ptab}`);
            if (target) { target.style.display = ''; target.classList.add('active'); }
        });
    });

    // ===== CLOSE MODALS =====
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
            propsPanel.classList.remove('active');
            notifPanel.classList.remove('active');
            contextMenu.classList.remove('active');
            if (isConnecting) { isConnecting = false; connectionStart = null; removeTempConnection(); canvasContainer.classList.remove('connecting'); }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openCmdPalette(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            if (document.getElementById('page-designer')?.classList.contains('active')) {
                e.preventDefault();
                canvasNodes.forEach(n => selectedNodes.add(n.id));
                updateNodeSelectionVisuals();
            }
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') return;
            if (selectedNodes.size > 0) {
                saveState();
                [...selectedNodes].forEach(id => deleteNode(id));
                selectedNodes.clear();
            }
        }
    });

    // Space key for panning
    let spaceDown = false;
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !spaceDown && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            spaceDown = true;
            canvasContainer.classList.add('panning');
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            spaceDown = false;
            if (!isPanning) canvasContainer.classList.remove('panning');
        }
    });

    canvasContainer?.addEventListener('mousedown', (e) => {
        if (spaceDown && e.button === 0) {
            isPanning = true;
            panStart.x = e.clientX - panOffset.x;
            panStart.y = e.clientY - panOffset.y;
            e.preventDefault();
        }
    });

    // ===== LOCAL STORAGE =====
    function saveToLocalStorage() {
        try {
            localStorage.setItem('cf-canvas', JSON.stringify({
                nodes: canvasNodes,
                connections,
                nodeIdCounter,
                connectionIdCounter,
                archName: document.getElementById('arch-name-crumb')?.textContent
            }));
        } catch (e) { /* ignore */ }
    }

    function loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('cf-canvas');
            if (!saved) return;
            const data = JSON.parse(saved);
            if (data.nodes && data.nodes.length > 0) {
                canvasNodes = data.nodes;
                connections = data.connections || [];
                nodeIdCounter = data.nodeIdCounter || canvasNodes.length;
                connectionIdCounter = data.connectionIdCounter || connections.length;
                if (data.archName) document.getElementById('arch-name-crumb').textContent = data.archName;
                canvasNodes.forEach(n => renderCanvasNode(n));
                updateCode();
                drawConnections();
                updateStatusBar();
                hideCanvasEmpty();
                updateMinimap();
            }
        } catch (e) { /* ignore */ }
    }

    loadFromLocalStorage();

    // ===== CONTAINER DRAG & DROP =====
    document.querySelectorAll('.container-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const containerType = item.dataset.container;
            const label = item.querySelector('span').textContent;
            const iconEl = item.querySelector('.container-icon');
            const color = iconEl ? iconEl.style.background : '#6366f1';
            draggedDesign = { type: 'container', label, containerType, color, icon: iconEl?.textContent || 'C' };
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', 'container');
        });
        item.addEventListener('dragend', () => { draggedDesign = null; });
    });

    // ===== DESIGN TOOLS =====
    let designNodes = [];
    let designIdCounter = 0;
    let draggedDesign = null;
    let isDraggingDesign = false;
    let designDragOffset = { x: 0, y: 0 };
    let selectedDesignNode = null;

    // Toggle design tool panels
    document.querySelectorAll('.design-tool-item').forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            const panel = document.getElementById('design-panel-' + tool);
            const wasActive = item.classList.contains('active');

            // Close all panels first
            document.querySelectorAll('.design-tool-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.design-panel').forEach(p => p.style.display = 'none');

            // Toggle the clicked one
            if (!wasActive && panel) {
                item.classList.add('active');
                panel.style.display = '';
            }
        });
    });

    // Drag design elements
    document.querySelectorAll('.design-element').forEach(el => {
        el.addEventListener('dragstart', (e) => {
            draggedDesign = JSON.parse(el.dataset.design);
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/plain', 'design');
        });
        el.addEventListener('dragend', () => { draggedDesign = null; });
    });

    // Drop design elements on canvas
    canvasContainer.addEventListener('drop', (e) => {
        if (!draggedDesign) return;
        e.preventDefault();
        const rect = canvasContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / zoomLevel - 40;
        const y = (e.clientY - rect.top - panOffset.y) / zoomLevel - 20;
        addDesignNode(draggedDesign, Math.max(0, x), Math.max(0, y));
        draggedDesign = null;
    });

    function addDesignNode(design, x, y) {
        const id = 'design-' + designIdCounter++;
        const node = { id, ...design, x, y };
        designNodes.push(node);
        renderDesignNode(node);
        hideCanvasEmpty();
        showToast(`${design.label} added to canvas`, 'success');
    }

    function renderDesignNode(node) {
        const div = document.createElement('div');
        div.className = 'canvas-design-node just-added';
        div.id = node.id;
        div.style.left = node.x + 'px';
        div.style.top = node.y + 'px';

        let inner = '';
        switch (node.type) {
            case 'text':
                inner = `<div class="design-node-text" contenteditable="true">Text box</div>`;
                break;
            case 'note':
                inner = `<div class="design-node-note" contenteditable="true">Add your note here...</div>`;
                break;
            case 'label':
                inner = `<div class="design-node-label">${node.label}</div>`;
                break;
            case 'divider':
                inner = `<div class="design-node-divider"></div>`;
                break;
            case 'rectangle':
                inner = `<div class="design-node-rect"></div>`;
                break;
            case 'rounded-rect':
                inner = `<div class="design-node-rect rounded"></div>`;
                break;
            case 'arrow-right':
                inner = `<div class="design-node-arrow">&#8594;</div>`;
                break;
            case 'arrow-down':
                inner = `<div class="design-node-arrow">&#8595;</div>`;
                break;
            case 'icon':
                inner = `<div class="design-node-icon"><span class="icon-symbol" style="color:${node.color}">${node.icon}</span><span class="icon-label">${node.label}</span></div>`;
                break;
            case 'logo':
                inner = `<div class="design-node-logo"><div class="logo-badge" style="background:${node.color}">${node.icon}</div><span class="logo-name">${node.label}</span></div>`;
                break;
            case 'shape':
                const shapeClass = node.label === 'Circle' ? 'circle' : node.label === 'Diamond' ? 'diamond' : '';
                inner = `<div class="design-node-shape ${shapeClass}"><span style="color:${node.color}">${node.icon}</span></div>`;
                break;
            case 'container':
                inner = `<div class="design-node-container" style="border-color:${node.color}"><div class="container-header" style="background:${node.color}">${node.label}</div><div class="container-body">Drop resources here</div></div>`;
                break;
            default:
                inner = `<div class="design-node-text">${node.label}</div>`;
        }

        div.innerHTML = `<button class="design-node-delete" data-id="${node.id}">&times;</button>${inner}`;
        canvasArea.appendChild(div);
        setTimeout(() => div.classList.remove('just-added'), 300);

        // Drag to move
        div.addEventListener('mousedown', (e) => {
            if (e.target.closest('.design-node-delete')) return;
            if (e.target.isContentEditable) return; // Don't drag while editing text
            selectedDesignNode = node;
            isDraggingDesign = true;
            const r = div.getBoundingClientRect();
            designDragOffset.x = e.clientX - r.left;
            designDragOffset.y = e.clientY - r.top;
            // Deselect canvas nodes
            selectedNodes.clear();
            updateNodeSelectionVisuals();
            div.classList.add('selected');
            e.preventDefault();
        });

        // Delete
        div.querySelector('.design-node-delete').addEventListener('click', () => {
            designNodes = designNodes.filter(n => n.id !== node.id);
            div.remove();
            showToast(`${node.label} removed`, 'info');
        });
    }

    // Design node dragging
    document.addEventListener('mousemove', (e) => {
        if (isDraggingDesign && selectedDesignNode) {
            const containerRect = canvasContainer.getBoundingClientRect();
            const x = (e.clientX - containerRect.left - panOffset.x) / zoomLevel - designDragOffset.x;
            const y = (e.clientY - containerRect.top - panOffset.y) / zoomLevel - designDragOffset.y;
            selectedDesignNode.x = Math.max(0, x);
            selectedDesignNode.y = Math.max(0, y);
            const el = document.getElementById(selectedDesignNode.id);
            if (el) { el.style.left = selectedDesignNode.x + 'px'; el.style.top = selectedDesignNode.y + 'px'; }
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingDesign) {
            isDraggingDesign = false;
            if (selectedDesignNode) {
                const el = document.getElementById(selectedDesignNode.id);
                if (el) el.classList.remove('selected');
            }
            selectedDesignNode = null;
        }
    });

    // ===== ANIMATED CONNECTIONS =====

    // ===== RUBBER BAND SELECTION =====
    let isBoxSelecting = false;
    let boxStart = { x: 0, y: 0 };
    const selectionBox = document.getElementById('selection-box');

    canvasContainer?.addEventListener('mousedown', (e) => {
        if (e.target === canvasContainer || e.target === canvasArea) {
            if (e.button === 0 && !e.altKey && !spaceDown && !e.target.closest('.canvas-node') && !e.target.closest('.canvas-controls') && !e.target.closest('.canvas-float-tools') && !e.target.closest('.minimap') && !e.target.closest('.canvas-status')) {
                isBoxSelecting = true;
                boxStart.x = e.clientX;
                boxStart.y = e.clientY;
                selectionBox.style.left = e.clientX + 'px';
                selectionBox.style.top = e.clientY + 'px';
                selectionBox.style.width = '0px';
                selectionBox.style.height = '0px';
                selectionBox.style.display = 'block';
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isBoxSelecting) {
            const x = Math.min(e.clientX, boxStart.x);
            const y = Math.min(e.clientY, boxStart.y);
            const w = Math.abs(e.clientX - boxStart.x);
            const h = Math.abs(e.clientY - boxStart.y);
            selectionBox.style.left = x + 'px';
            selectionBox.style.top = y + 'px';
            selectionBox.style.width = w + 'px';
            selectionBox.style.height = h + 'px';
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isBoxSelecting) {
            isBoxSelecting = false;
            selectionBox.style.display = 'none';
            const boxRect = {
                left: Math.min(e.clientX, boxStart.x),
                top: Math.min(e.clientY, boxStart.y),
                right: Math.max(e.clientX, boxStart.x),
                bottom: Math.max(e.clientY, boxStart.y)
            };
            if (boxRect.right - boxRect.left > 5 && boxRect.bottom - boxRect.top > 5) {
                selectedNodes.clear();
                canvasNodes.forEach(node => {
                    const el = document.getElementById(node.id);
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    if (rect.left < boxRect.right && rect.right > boxRect.left && rect.top < boxRect.bottom && rect.bottom > boxRect.top) {
                        selectedNodes.add(node.id);
                    }
                });
                updateNodeSelectionVisuals();
                if (selectedNodes.size > 0) showToast(`${selectedNodes.size} resources selected`, 'info');
            }
        }
    });

    // ===== RESOURCE TOOLTIPS =====
    let tooltipEl = null;

    document.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.resource-item');
        if (!item) return;
        try {
            const data = JSON.parse(item.dataset.resource.replace(/&#39;/g, "'"));
            const cost = costMap[data.id] || 0;
            if (tooltipEl) tooltipEl.remove();
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'resource-tooltip';
            tooltipEl.innerHTML = `<strong>${data.label}</strong><div class="tt-type">${data.tf}</div><div class="tt-detail">${data.detail}</div>${cost > 0 ? `<div class="tt-cost">~$${cost.toFixed(2)}/mo</div>` : '<div class="tt-cost">Free tier</div>'}`;
            document.body.appendChild(tooltipEl);
            const rect = item.getBoundingClientRect();
            tooltipEl.style.left = (rect.right + 8) + 'px';
            tooltipEl.style.top = rect.top + 'px';
        } catch(e) {}
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.resource-item') && tooltipEl) {
            tooltipEl.remove();
            tooltipEl = null;
        }
    });

    // ===== COPY CODE BUTTON =====
    function addCopyButton() {
        const codeSection = document.getElementById('cp-resources');
        if (!codeSection) return;
        let btn = codeSection.querySelector('.code-copy-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.textContent = 'Copy';
            btn.style.position = 'sticky';
            btn.style.float = 'right';
            btn.style.marginTop = '-28px';
            btn.style.marginRight = '4px';
            btn.style.zIndex = '5';
            const editor = document.getElementById('code-editor');
            if (editor) editor.parentElement.style.position = 'relative';
            editor?.parentElement?.insertBefore(btn, editor);
        }
        btn.onclick = () => {
            const code = document.getElementById('generated-code')?.textContent || '';
            navigator.clipboard?.writeText(code).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
            }).catch(() => showToast('Copy failed', 'error'));
        };
    }

    // Copy button is added via applyPostLoadEnhancements and in updateCode directly

    // ===== IMPORT TERRAFORM =====
    document.getElementById('import-btn')?.addEventListener('click', () => {
        document.getElementById('import-modal').classList.add('active');
    });
    document.getElementById('import-modal-close')?.addEventListener('click', () => {
        document.getElementById('import-modal').classList.remove('active');
    });

    document.getElementById('import-tf-btn')?.addEventListener('click', () => {
        const input = document.getElementById('import-tf-input').value.trim();
        if (!input) return;

        // Parse resource blocks from HCL
        const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"/g;
        const resources = [];
        let match;
        while ((match = resourceRegex.exec(input)) !== null) {
            resources.push({ type: match[1], name: match[2] });
        }

        if (resources.length === 0) {
            showToast('No resource blocks found in the code', 'warning');
            return;
        }

        document.getElementById('import-modal').classList.remove('active');
        saveState();
        canvasNodes = [];
        connections = [];
        canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
        openDesigner();

        const typeMap = {
            'aws_instance': { id: 'ec2', label: 'EC2', catName: 'Compute' },
            'aws_vpc': { id: 'vpc', label: 'VPC', catName: 'Network' },
            'aws_subnet': { id: 'subnet', label: 'Subnet', catName: 'Network' },
            'aws_lb': { id: 'alb', label: 'ALB', catName: 'Network' },
            'aws_db_instance': { id: 'rds', label: 'RDS', catName: 'Database' },
            'aws_s3_bucket': { id: 's3', label: 'S3', catName: 'Storage' },
            'aws_lambda_function': { id: 'lambda', label: 'Lambda', catName: 'Compute' },
            'aws_security_group': { id: 'sg', label: 'Sec Group', catName: 'Security' },
            'aws_iam_role': { id: 'iam_role', label: 'IAM Role', catName: 'Security' },
            'aws_rds_cluster': { id: 'aurora', label: 'Aurora', catName: 'Database' },
            'aws_ecs_cluster': { id: 'ecs', label: 'ECS', catName: 'Compute' },
            'aws_dynamodb_table': { id: 'dynamodb', label: 'DynamoDB', catName: 'Database' },
            'aws_cloudfront_distribution': { id: 'cloudfront', label: 'CloudFront', catName: 'Network' },
            'aws_api_gateway_rest_api': { id: 'apigateway', label: 'API GW', catName: 'Network' },
            'aws_kms_key': { id: 'kms', label: 'KMS', catName: 'Security' },
            'aws_nat_gateway': { id: 'natgw', label: 'NAT GW', catName: 'Network' },
            'aws_elasticache_cluster': { id: 'elasticache', label: 'ElastiCache', catName: 'Database' },
        };

        const cols = Math.ceil(Math.sqrt(resources.length));
        let delay = 0;
        resources.forEach((r, i) => {
            const mapped = typeMap[r.type] || { id: r.type.split('_').pop(), label: r.type.split('_').pop(), catName: 'Compute' };
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 60 + col * 240;
            const y = 40 + row * 140;
            setTimeout(() => {
                addNodeToCanvas({
                    id: mapped.id,
                    label: mapped.label,
                    type: r.type,
                    detail: r.name,
                    tf: r.type,
                    catName: mapped.catName
                }, x, y);
                // Override the generated name with the actual TF name
                const node = canvasNodes[canvasNodes.length - 1];
                if (node) {
                    node.name = r.name;
                    const el = document.getElementById(node.id);
                    if (el) el.querySelector('.node-name').textContent = r.name;
                }
            }, delay);
            delay += 200;
        });

        setTimeout(() => {
            updateCode();
            showToast(`Imported ${resources.length} resources from Terraform`, 'success');
            saveToLocalStorage();
        }, delay + 300);
    });

    // ===== KEYBOARD SHORTCUTS PANEL =====
    document.getElementById('shortcuts-close')?.addEventListener('click', () => {
        document.getElementById('shortcuts-modal').classList.remove('active');
    });

    // ===== ENHANCED KEYBOARD SHORTCUTS =====
    const _origKeydown = null;
    document.addEventListener('keydown', (e) => {
        // ? key for shortcuts
        if (e.key === '?' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            document.getElementById('shortcuts-modal').classList.add('active');
        }
        // Ctrl+D for dark mode toggle (when not focused on input)
        if ((e.ctrlKey || e.metaKey) && e.key === 'd' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // ===== FLOATING CANVAS TOOLS =====
    document.getElementById('float-undo')?.addEventListener('click', undo);
    document.getElementById('float-redo')?.addEventListener('click', redo);
    document.getElementById('float-grid')?.addEventListener('click', function () {
        snapToGrid = !snapToGrid;
        this.classList.toggle('active', snapToGrid);
        document.getElementById('snap-grid-btn')?.classList.toggle('active', snapToGrid);
        showToast(snapToGrid ? 'Grid snap enabled' : 'Grid snap disabled', 'info');
    });
    document.getElementById('float-align')?.addEventListener('click', () => {
        if (canvasNodes.length === 0) return;
        saveState();
        const sorted = [...canvasNodes].sort((a, b) => a.x - b.x || a.y - b.y);
        const cols = Math.ceil(Math.sqrt(sorted.length));
        sorted.forEach((node, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            node.x = 60 + col * 240;
            node.y = 40 + row * 140;
            const el = document.getElementById(node.id);
            if (el) { el.style.left = node.x + 'px'; el.style.top = node.y + 'px'; }
        });
        drawConnections();
        updateMinimap();
        saveToLocalStorage();
        showToast('Nodes auto-aligned', 'success');
    });

    // ===== DIAGRAM UPLOAD =====
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('diagram-file-input');
    const uploadPreview = document.getElementById('upload-preview');
    const analyzeBtn = document.getElementById('analyze-diagram-btn');
    let uploadedFile = null;

    document.getElementById('upload-diagram-btn')?.addEventListener('click', () => {
        document.getElementById('upload-diagram-modal').classList.add('active');
    });

    document.getElementById('upload-diagram-close')?.addEventListener('click', () => {
        document.getElementById('upload-diagram-modal').classList.remove('active');
    });

    uploadZone?.addEventListener('click', () => fileInput?.click());

    uploadZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone?.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleDiagramFile(file);
    });

    fileInput?.addEventListener('change', (e) => {
        if (e.target.files[0]) handleDiagramFile(e.target.files[0]);
    });

    function handleDiagramFile(file) {
        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('upload-preview-img').src = e.target.result;
            document.getElementById('upload-file-name').textContent = file.name;
            uploadZone.style.display = 'none';
            uploadPreview.style.display = '';
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('remove-upload')?.addEventListener('click', () => {
        uploadedFile = null;
        uploadZone.style.display = '';
        uploadPreview.style.display = 'none';
        analyzeBtn.disabled = true;
        fileInput.value = '';
    });

    analyzeBtn?.addEventListener('click', () => {
        if (!uploadedFile) return;
        document.getElementById('upload-diagram-modal').classList.remove('active');
        showToast('Analyzing diagram...', 'info');

        // Simulate AI analysis of the diagram
        setTimeout(() => {
            saveState();
            canvasNodes = [];
            connections = [];
            canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
            canvasArea.querySelectorAll('.canvas-design-node').forEach(n => n.remove());
            openDesigner();

            // Generate a realistic architecture based on "detected" components
            const detectedResources = [
                { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 40, y: 40 },
                { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'public-1a', tf: 'aws_subnet', catName: 'Network' }, x: 40, y: 180 },
                { resource: { id: 'sg', label: 'Sec Group', type: 'aws_security_group', detail: 'web-sg', tf: 'aws_security_group', catName: 'Security' }, x: 40, y: 320 },
                { resource: { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb', catName: 'Network' }, x: 280, y: 40 },
                { resource: { id: 'ec2', label: 'EC2', type: 'aws_instance', detail: 't3.large', tf: 'aws_instance', catName: 'Compute' }, x: 280, y: 180 },
                { resource: { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL', tf: 'aws_db_instance', catName: 'Database' }, x: 280, y: 320 },
                { resource: { id: 's3', label: 'S3', type: 'aws_s3_bucket', detail: 'static-assets', tf: 'aws_s3_bucket', catName: 'Storage' }, x: 520, y: 40 },
                { resource: { id: 'cloudfront', label: 'CloudFront', type: 'aws_cloudfront_distribution', detail: 'CDN', tf: 'aws_cloudfront_distribution', catName: 'Network' }, x: 520, y: 180 },
                { resource: { id: 'iam_role', label: 'IAM Role', type: 'aws_iam_role', detail: 'app-role', tf: 'aws_iam_role', catName: 'Security' }, x: 520, y: 320 },
            ];

            let delay = 0;
            detectedResources.forEach(r => {
                setTimeout(() => addNodeToCanvas(r.resource, r.x, r.y), delay);
                delay += 200;
            });

            setTimeout(() => {
                // Create connections based on typical architecture
                const ids = canvasNodes.map(n => n.id);
                const connPairs = [[0,3],[3,4],[4,5],[0,1],[1,4],[2,4],[6,7],[8,4]];
                connPairs.forEach(([a,b]) => {
                    if (ids[a] && ids[b]) {
                        connections.push({
                            id: `conn-${connectionIdCounter++}`,
                            from: { nodeId: ids[a], port: 'right' },
                            to: { nodeId: ids[b], port: 'left' }
                        });
                    }
                });
                drawConnections();
                updateStatusBar();
                saveToLocalStorage();
                showToast(`Diagram analyzed! Detected ${detectedResources.length} resources. Terraform code generated.`, 'success');
            }, delay + 500);

            // Reset upload state
            uploadedFile = null;
            if (uploadZone) uploadZone.style.display = '';
            if (uploadPreview) uploadPreview.style.display = 'none';
            if (analyzeBtn) analyzeBtn.disabled = true;
            if (fileInput) fileInput.value = '';
        }, 2000);
    });

    // ===== MODULE CATALOG =====
    const moduleDefinitions = {
        'vpc-full': [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 60 },
            { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'public-1a', tf: 'aws_subnet', catName: 'Network' }, x: 300, y: 20 },
            { resource: { id: 'subnet', label: 'Subnet', type: 'aws_subnet', detail: 'private-1a', tf: 'aws_subnet', catName: 'Network' }, x: 300, y: 130 },
            { resource: { id: 'natgw', label: 'NAT GW', type: 'aws_nat_gateway', detail: 'elastic IP', tf: 'aws_nat_gateway', catName: 'Network' }, x: 540, y: 20 },
            { resource: { id: 'sg', label: 'Sec Group', type: 'aws_security_group', detail: 'default', tf: 'aws_security_group', catName: 'Security' }, x: 540, y: 130 },
        ],
        'eks': [
            { resource: { id: 'vpc', label: 'VPC', type: 'aws_vpc', detail: '10.0.0.0/16', tf: 'aws_vpc', catName: 'Network' }, x: 60, y: 80 },
            { resource: { id: 'ecs', label: 'EKS', type: 'aws_eks_cluster', detail: 'v1.29', tf: 'aws_eks_cluster', catName: 'Compute' }, x: 300, y: 30 },
            { resource: { id: 'autoscaling', label: 'Node Group', type: 'aws_eks_node_group', detail: 't3.large x3', tf: 'aws_eks_node_group', catName: 'Compute' }, x: 300, y: 150 },
            { resource: { id: 'iam_role', label: 'Cluster Role', type: 'aws_iam_role', detail: 'eks-cluster', tf: 'aws_iam_role', catName: 'Security' }, x: 540, y: 80 },
        ],
        'rds-full': [
            { resource: { id: 'rds', label: 'RDS', type: 'aws_db_instance', detail: 'PostgreSQL 16', tf: 'aws_db_instance', catName: 'Database' }, x: 60, y: 60 },
            { resource: { id: 'subnet', label: 'DB Subnet', type: 'aws_db_subnet_group', detail: 'private', tf: 'aws_db_subnet_group', catName: 'Network' }, x: 300, y: 20 },
            { resource: { id: 'sg', label: 'DB SG', type: 'aws_security_group', detail: 'port 5432', tf: 'aws_security_group', catName: 'Security' }, x: 300, y: 140 },
            { resource: { id: 'kms', label: 'KMS Key', type: 'aws_kms_key', detail: 'db-encryption', tf: 'aws_kms_key', catName: 'Security' }, x: 540, y: 80 },
        ],
        's3-full': [
            { resource: { id: 's3', label: 'S3', type: 'aws_s3_bucket', detail: 'private', tf: 'aws_s3_bucket', catName: 'Storage' }, x: 60, y: 60 },
            { resource: { id: 'kms', label: 'KMS Key', type: 'aws_kms_key', detail: 'bucket-encryption', tf: 'aws_kms_key', catName: 'Security' }, x: 300, y: 20 },
            { resource: { id: 'iam_policy', label: 'Bucket Policy', type: 'aws_s3_bucket_policy', detail: 'access control', tf: 'aws_s3_bucket_policy', catName: 'Security' }, x: 300, y: 140 },
        ],
        'alb-full': [
            { resource: { id: 'alb', label: 'ALB', type: 'aws_lb', detail: 'internet-facing', tf: 'aws_lb', catName: 'Network' }, x: 60, y: 60 },
            { resource: { id: 'sg', label: 'ALB SG', type: 'aws_security_group', detail: '80/443', tf: 'aws_security_group', catName: 'Security' }, x: 300, y: 20 },
            { resource: { id: 'acm', label: 'SSL Cert', type: 'aws_acm_certificate', detail: '*.example.com', tf: 'aws_acm_certificate', catName: 'Security' }, x: 300, y: 140 },
        ],
        'iam-full': [
            { resource: { id: 'iam_role', label: 'IAM Role', type: 'aws_iam_role', detail: 'service role', tf: 'aws_iam_role', catName: 'Security' }, x: 60, y: 60 },
            { resource: { id: 'iam_policy', label: 'IAM Policy', type: 'aws_iam_policy', detail: 'least privilege', tf: 'aws_iam_policy', catName: 'Security' }, x: 300, y: 20 },
            { resource: { id: 'cognito', label: 'Cognito', type: 'aws_cognito_user_pool', detail: 'user auth', tf: 'aws_cognito_user_pool', catName: 'Security' }, x: 300, y: 140 },
        ],
    };

    document.getElementById('module-catalog-btn')?.addEventListener('click', () => {
        document.getElementById('catalog-modal').classList.add('active');
    });

    document.getElementById('catalog-modal-close')?.addEventListener('click', () => {
        document.getElementById('catalog-modal').classList.remove('active');
    });

    // Catalog tabs
    document.querySelectorAll('.catalog-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Filter could be implemented but all modules shown for now
        });
    });

    // Catalog search
    document.getElementById('catalog-search-input')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.catalog-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(q) ? '' : 'none';
        });
    });

    // Use Module buttons
    document.querySelectorAll('.btn-use-module').forEach(btn => {
        btn.addEventListener('click', () => {
            const moduleId = btn.dataset.module;
            const resources = moduleDefinitions[moduleId];
            if (!resources) return;

            document.getElementById('catalog-modal').classList.remove('active');
            saveState();
            canvasNodes = [];
            connections = [];
            canvasArea.querySelectorAll('.canvas-node').forEach(n => n.remove());
            openDesigner();

            let delay = 0;
            resources.forEach(r => {
                setTimeout(() => addNodeToCanvas(r.resource, r.x, r.y), delay);
                delay += 200;
            });

            setTimeout(() => {
                // Auto-connect sequentially
                const ids = canvasNodes.map(n => n.id);
                for (let i = 0; i < ids.length - 1; i++) {
                    connections.push({
                        id: `conn-${connectionIdCounter++}`,
                        from: { nodeId: ids[i], port: 'right' },
                        to: { nodeId: ids[i + 1], port: 'left' }
                    });
                }
                drawConnections();
                updateStatusBar();
                saveToLocalStorage();
                showToast(`Module loaded with ${resources.length} resources`, 'success');
            }, delay + 300);
        });
    });

    // ===== MODULE IMPORT =====
    document.getElementById('module-import-btn')?.addEventListener('click', () => {
        document.getElementById('module-import-modal').classList.add('active');
    });

    document.getElementById('module-import-modal-close')?.addEventListener('click', () => {
        document.getElementById('module-import-modal').classList.remove('active');
    });

    document.getElementById('module-import-cancel')?.addEventListener('click', () => {
        document.getElementById('module-import-modal').classList.remove('active');
    });

    document.getElementById('module-import-confirm')?.addEventListener('click', () => {
        const source = document.getElementById('module-source-input')?.value.trim();
        const version = document.getElementById('module-version-input')?.value.trim();
        const name = document.getElementById('module-name-input')?.value.trim();

        if (!source || !name) {
            showToast('Please fill in Module Source and Name', 'warning');
            return;
        }

        document.getElementById('module-import-modal').classList.remove('active');
        openDesigner();

        // Create a module node on canvas
        saveState();
        const moduleResource = {
            id: 'module_' + name,
            label: name,
            type: 'module.' + name,
            detail: source + (version ? ' v' + version : ''),
            tf: 'module',
            catName: 'Compute'
        };
        addNodeToCanvas(moduleResource, 200 + Math.random() * 200, 100 + Math.random() * 100);
        showToast(`Module "${name}" imported from ${source}`, 'success');
    });

    // ===== INIT =====
    // Re-apply status dots and animated connections on restored nodes
    function applyPostLoadEnhancements() {
        // Add status dots to all existing nodes
        canvasArea.querySelectorAll('.canvas-node').forEach(el => {
            const top = el.querySelector('.node-top');
            if (top && !top.querySelector('.node-status-dot')) {
                const dot = document.createElement('div');
                dot.className = 'node-status-dot';
                top.appendChild(dot);
            }
        });
        // Re-draw connections with animation
        drawConnections();
        // Add copy button
        addCopyButton();
        updateMinimap();
    }

    setTimeout(applyPostLoadEnhancements, 200);

    updateUndoRedoButtons();
    updateStatusBar();

    window.showToast = showToast;
});

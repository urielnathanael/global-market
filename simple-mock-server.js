import http from 'http';
import url from 'url';

const PORT = 8000;

// Mock users database
const users = [
    {
        id: 1,
        nom: 'Administrateur',
        email: 'admin@entreprise.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        id: 2,
        nom: 'Vendeur Test',
        email: 'vendeur@entreprise.com',
        password: 'vendeur123',
        role: 'vendeur'
    },
    {
        id: 3,
        nom: 'Gestionnaire Stock',
        email: 'stock@entreprise.com',
        password: 'stock123',
        role: 'gestionnaire_stock'
    }
];

// Simple JWT-like token generator
function generateToken(user) {
    return `mock-jwt-token-${user.id}-${Date.now()}`;
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    console.log(`${req.method} ${path}`);

    // Handle auth endpoint
    if (path === '/api/auth.php' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                if (data.action === 'login') {
                    const user = users.find(u => u.email === data.email && u.password === data.password);

                    if (user) {
                        const token = generateToken(user);
                        const response = {
                            success: true,
                            message: 'Connexion réussie',
                            token: token,
                            user: {
                                id: user.id,
                                nom: user.nom,
                                email: user.email,
                                role: user.role
                            }
                        };

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(response));
                        console.log(`✅ Login successful for ${user.email}`);
                    } else {
                        const response = {
                            success: false,
                            message: 'Email ou mot de passe incorrect'
                        };

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(response));
                        console.log(`❌ Login failed for ${data.email}`);
                    }
                } else if (data.action === 'logout') {
                    const response = {
                        success: true,
                        message: 'Déconnexion réussie'
                    };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                    console.log('✅ Logout successful');
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Action non reconnue' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
            }
        });

        return;
    }

    // Handle other API endpoints with mock responses
    if (path.startsWith('/api/')) {
        const response = {
            success: true,
            message: 'Mock API endpoint',
            data: [],
            total: 0,
            page: 1,
            per_page: 10
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        return;
    }

    // 404 for other paths
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
    console.log('📧 Test credentials:');
    console.log('   👤 Admin: admin@entreprise.com / admin123');
    console.log('   👤 Vendeur: vendeur@entreprise.com / vendeur123');
    console.log('   👤 Stock: stock@entreprise.com / stock123');
    console.log('');
    console.log('🔗 Frontend should be configured with:');
    console.log('   VITE_API_URL=http://localhost:8000/api');
});
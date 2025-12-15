const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Mock users database
const users = [
    {
        id: 1,
        nom: 'Administrateur',
        email: 'admin@entreprise.com',
        password: 'admin123', // In real app, this would be hashed
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

// Auth endpoint
app.post('/api/auth.php', (req, res) => {
    const { action, email, password } = req.body;

    if (action === 'login') {
        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });
    } else if (action === 'logout') {
        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Action non reconnue'
        });
    }
});

// Mock products endpoint
app.get('/api/produits.php', (req, res) => {
    res.json({
        success: true,
        message: 'Produits récupérés',
        data: [
            {
                id: 1,
                nom: 'Produit Test 1',
                description: 'Description du produit test',
                prix: 25.99,
                quantite: 100,
                categorie: 'Électronique',
                statut: 'actif',
                created_at: '2024-01-01',
                updated_at: '2024-01-01'
            }
        ],
        total: 1,
        page: 1,
        per_page: 10
    });
});

// Mock other endpoints with basic responses
app.all('/api/*', (req, res) => {
    res.json({
        success: true,
        message: 'Mock endpoint - fonctionnalité non implémentée',
        data: []
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log('📧 Test credentials:');
    console.log('   Admin: admin@entreprise.com / admin123');
    console.log('   Vendeur: vendeur@entreprise.com / vendeur123');
    console.log('   Stock: stock@entreprise.com / stock123');
});
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter/services.dart';

// Dynamic API detection based on platform
String get apiBaseUrl {
  if (kIsWeb) {
    return 'http://localhost:3002/api';
  } else {
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:3002/api'
        : 'http://localhost:3002/api';
  }
}

class CashifyUserApp extends StatelessWidget {
  const CashifyUserApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cashifin Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D9488),
          primary: const Color(0xFF0D9488),
          secondary: const Color(0xFF0C213A),
          background: const Color(0xFFF8FAFC),
        ),
      ),
      home: const MainTabContainer(),
    );
  }
}

class MainTabContainer extends StatefulWidget {
  const MainTabContainer({super.key});

  @override
  State<MainTabContainer> createState() => _MainTabContainerState();
}

class _MainTabContainerState extends State<MainTabContainer> {
  int _currentIndex = 0;
  String _activeLocation = 'Gurgaon';
  bool _isLoading = true;
  bool _showOnboarding = true;

  // Logged in User Session
  Map<String, dynamic>? _user;

  // Datasets from API
  List<dynamic> _categories = [];
  List<dynamic> _brands = [];
  List<dynamic> _models = [];
  List<dynamic> _questions = [];
  List<dynamic> _rules = [];
  List<dynamic> _faqs = [];
  List<dynamic> _articles = [];
  List<dynamic> _myOrders = [];

  // Active Flow Selections
  String _flowMode = 'sell'; // 'sell', 'buy', 'exchange'
  dynamic _selectedCategory;
  dynamic _selectedBrand;
  dynamic _selectedModel;

  // Refurbished Devices Search & Scope
  String _refurbishedSearch = '';
  String? _refurbishedScope;

  final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 5),
  ));

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await _loadUserSession();
    await _fetchData();
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _showOnboarding = !(prefs.getBool('onboarding_complete') ?? false);
      });
    } catch (_) {}
  }

  Future<void> _loadUserSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userStr = prefs.getString('cashifin_user');
      if (userStr != null) {
        setState(() {
          _user = jsonDecode(userStr);
        });
      }
    } catch (e) {
      debugPrint('Error loading user session: $e');
    }
  }

  Future<void> _saveUserSession(Map<String, dynamic>? userSession) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      if (userSession == null) {
        await prefs.remove('cashifin_user');
      } else {
        await prefs.setString('cashifin_user', jsonEncode(userSession));
      }
      setState(() {
        _user = userSession;
      });
    } catch (e) {
      debugPrint('Error saving user session: $e');
    }
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    try {
      // Parallel API requests
      final responses = await Future.wait([
        _dio.get('$apiBaseUrl/categories'),
        _dio.get('$apiBaseUrl/brands'),
        _dio.get('$apiBaseUrl/models'),
        _dio.get('$apiBaseUrl/questions'),
        _dio.get('$apiBaseUrl/pricingRules'),
        _dio.get('$apiBaseUrl/faqs'),
        _dio.get('$apiBaseUrl/benefits'),
        _dio.get('$apiBaseUrl/articles'),
      ]);

      setState(() {
        _categories = responses[0].data ?? [];
        _brands = responses[1].data ?? [];
        _models = responses[2].data ?? [];
        _questions = responses[3].data ?? [];
        _rules = responses[4].data ?? [];
        _faqs = responses[5].data ?? [];
        _articles = responses[7].data ?? [];
      });

      if (_user != null) {
        await _fetchUserOrders();
      }
    } catch (e) {
      debugPrint('API Error: $e. Falling back to default datasets.');
      _loadFallbackData();
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchUserOrders() async {
    if (_user == null) return;
    try {
      final res = await _dio.get('$apiBaseUrl/orders');
      final List<dynamic> allOrders = res.data ?? [];
      final userPhone = _user!['phone'] as String;
      setState(() {
        _myOrders = allOrders.where((o) {
          final custPhone = o['phone']?.toString().replaceAll(' ', '') ?? '';
          final cleanUserPhone = userPhone.replaceAll(' ', '');
          return o['customer'] == _user!['name'] || custPhone.contains(cleanUserPhone) || cleanUserPhone.contains(custPhone);
        }).toList();
      });
    } catch (e) {
      debugPrint('Error loading user orders: $e');
    }
  }

  void _loadFallbackData() {
    setState(() {
      _categories = [
        {'id': 'CAT-001', 'name': 'Smartphones', 'slug': 'smartphones'},
        {'id': 'CAT-002', 'name': 'Laptops', 'slug': 'laptops'},
        {'id': 'CAT-003', 'name': 'Tablets', 'slug': 'tablets'},
        {'id': 'CAT-004', 'name': 'Smartwatches', 'slug': 'smartwatches'},
      ];
      _brands = [
        {'id': 'BRD-001', 'name': 'Apple', 'slug': 'apple', 'categories': ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches']},
        {'id': 'BRD-002', 'name': 'Samsung', 'slug': 'samsung', 'categories': ['Smartphones', 'Tablets', 'Smartwatches']},
      ];
      _models = [
        {'id': 'MDL-201', 'name': 'iPhone 15 Pro Max', 'brand': 'Apple', 'category': 'Smartphones', 'price': '₹63,068', 'rawBase': 63068, 'img': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=300'},
        {'id': 'MDL-202', 'name': 'MacBook Pro M3 16"', 'brand': 'Apple', 'category': 'Laptops', 'price': '₹1,23,090', 'rawBase': 123090, 'img': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300'},
      ];
      _questions = [
        {
          'id': 1,
          'text': 'Is the device turning on properly?',
          'options': [
            {'optionText': 'Yes', 'deductionType': 'flat', 'deductionValue': 0},
            {'optionText': 'No', 'deductionType': 'percentage', 'deductionValue': 50}
          ]
        },
        {
          'id': 2,
          'text': 'Screen Condition',
          'options': [
            {'optionText': 'Flawless', 'deductionType': 'flat', 'deductionValue': 0},
            {'optionText': 'Minor Scratches', 'deductionType': 'flat', 'deductionValue': 1500},
            {'optionText': 'Broken / Cracked', 'deductionType': 'percentage', 'deductionValue': 35}
          ]
        }
      ];
      _rules = [];
      _faqs = [
        {'question': 'How is device pricing calculated?', 'answer': 'Our pricing engine evaluates the base market value and deducts points based on physical, functional diagnostics and brand parameters.'}
      ];
      _articles = [
        {'title': 'Eco Recommerce Benefits', 'description': 'Circularity reduces environmental waste while recovering value.', 'image': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=300'}
      ];
    });
  }

  void _showLocationSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Select Your Location', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0C213A))),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: ['Gurgaon', 'Delhi', 'Noida', 'Bangalore', 'Mumbai', 'Kolkata'].map((city) {
                  return ChoiceChip(
                    label: Text(city, style: const TextStyle(fontWeight: FontWeight.bold)),
                    selected: _activeLocation == city,
                    onSelected: (selected) {
                      if (selected) {
                        setState(() => _activeLocation = city);
                        Navigator.pop(context);
                      }
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  void _showLoginSheet() {
    final phoneController = TextEditingController();
    final otpController = TextEditingController();
    bool otpSent = false;
    String errorMsg = '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Login or Register', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                  const SizedBox(height: 6),
                  const Text('Verify with phone number to manage and place device pickups.', style: TextStyle(color: Colors.grey, fontSize: 11)),
                  const SizedBox(height: 16),
                  if (errorMsg.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(10),
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
                      child: Text(errorMsg, style: TextStyle(color: Colors.red.shade800, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  if (!otpSent) ...[
                    TextField(
                      controller: phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Mobile Number',
                        hintText: 'Enter 10-digit number',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        prefixText: '+91 ',
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                        onPressed: () {
                          if (phoneController.text.trim().length >= 10) {
                            setSheetState(() {
                              otpSent = true;
                              errorMsg = '';
                            });
                          } else {
                            setSheetState(() => errorMsg = 'Please enter a valid 10 digit number.');
                          }
                        },
                        child: const Text('Send Verification OTP', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    )
                  ] else ...[
                    TextField(
                      controller: otpController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Enter OTP Code',
                        hintText: 'Enter any 4-digit code (e.g. 1234)',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                        onPressed: () async {
                          final phone = phoneController.text.trim();
                          setSheetState(() => errorMsg = '');
                          try {
                            // Fetch all users to check if match exists
                            final usersRes = await _dio.get('$apiBaseUrl/users');
                            final List<dynamic> allUsers = usersRes.data ?? [];
                            final match = allUsers.firstWhere(
                              (u) => u['phone']?.toString().replaceAll(' ', '').contains(phone) == true,
                              orElse: () => null,
                            );

                            if (match != null) {
                              final session = {
                                'name': match['name'],
                                'phone': match['phone'],
                                'email': match['email'] ?? 'user@cashifin.in',
                                'address': match['address'] ?? 'India',
                                'loggedIn': true
                              };
                              await _saveUserSession(session);
                              Navigator.pop(context);
                              _fetchUserOrders();
                            } else {
                              // Direct signup trigger sheet
                              Navigator.pop(context);
                              _showSignupSheet(phone);
                            }
                          } catch (e) {
                            // If API offline or user check fails, fallback log in
                            final session = {
                              'name': 'Adarsh Sachan',
                              'phone': '+91 $phone',
                              'email': 'adarsh@cashifin.in',
                              'address': 'B-45, Sector 62, Noida, UP',
                              'loggedIn': true
                            };
                            await _saveUserSession(session);
                            Navigator.pop(context);
                          }
                        },
                        child: const Text('Verify & Proceed', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    )
                  ]
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showSignupSheet(String phone) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final addressController = TextEditingController();
    String errorMsg = '';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Complete Profile', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                  const SizedBox(height: 6),
                  Text('Signing up phone: +91 $phone', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                  const SizedBox(height: 16),
                  if (errorMsg.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(10),
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(8)),
                      child: Text(errorMsg, style: TextStyle(color: Colors.red.shade800, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  TextField(
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: 'Full Name',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'Email Address',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: addressController,
                    decoration: InputDecoration(
                      labelText: 'Address Details',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                      onPressed: () async {
                        final name = nameController.text.trim();
                        final email = emailController.text.trim();
                        final address = addressController.text.trim();

                        if (name.isEmpty || email.isEmpty) {
                          setSheetState(() => errorMsg = 'Name and Email are required.');
                          return;
                        }

                        final newUser = {
                          'id': 'USR-${DateTime.now().millisecondsSinceEpoch.toString().substring(9)}',
                          'name': name,
                          'email': email,
                          'phone': '+91 $phone',
                          'address': address,
                          'date': '08 Aug 2026',
                          'wallet': '₹0',
                          'status': 'Active'
                        };

                        try {
                          await _dio.post(
                            '$apiBaseUrl/users',
                            data: {'action': 'create', 'item': newUser},
                          );
                          final session = {
                            'name': name,
                            'phone': '+91 $phone',
                            'email': email,
                            'address': address,
                            'loggedIn': true
                          };
                          await _saveUserSession(session);
                          Navigator.pop(context);
                          _fetchUserOrders();
                        } catch (e) {
                          setSheetState(() => errorMsg = 'Failed to record details in DB. Proceeding locally.');
                          final session = {
                            'name': name,
                            'phone': '+91 $phone',
                            'email': email,
                            'address': address,
                            'loggedIn': true
                          };
                          await _saveUserSession(session);
                          Navigator.pop(context);
                        }
                      },
                      child: const Text('Complete Signup', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF0D9488))),
      );
    }

    if (_showOnboarding) {
      return OnboardingScreen(
        onComplete: () async {
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setBool('onboarding_complete', true);
          } catch (_) {}
          setState(() {
            _showOnboarding = false;
          });
        },
      );
    }

    final List<Widget> pages = [
      _buildHomeView(),
      _buildOrdersView(),
      _buildSellNowDirectView(), // Triggered directly via Floating Action Button
      _buildSupportView(),
      _buildProfileView(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        toolbarHeight: 65,
        title: InkWell(
          onTap: _showLocationSelector,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      image: DecorationImage(
                        image: NetworkImage('http://localhost:3002/logo.jpg'),
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    'cashifin',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 22,
                      color: Color(0xFF0C213A),
                      letterSpacing: -0.8,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(Icons.keyboard_arrow_down, size: 16, color: Colors.grey.shade600),
                ],
              ),
              Text(
                'Buy | Sell | Exchange • $_activeLocation',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Color(0xFF0C213A), size: 24),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Please use the dynamic search box in the page body.')),
              );
            },
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_none_outlined, color: Color(0xFF0C213A), size: 24),
                onPressed: () {},
              ),
              Positioned(
                right: 6,
                top: 6,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: Color(0xFF0D9488),
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 14,
                    minHeight: 14,
                  ),
                  child: const Text(
                    '3',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            ],
          ),
          const SizedBox(width: 8),
        ],
        backgroundColor: Colors.white,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: Colors.grey.shade100, height: 1.0),
        ),
      ),
      body: pages[_currentIndex],
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _selectedCategory = null;
            _selectedBrand = null;
            _selectedModel = null;
            _currentIndex = 2; // Direct Sell Flow
          });
        },
        backgroundColor: const Color(0xFF0D9488),
        shape: const CircleBorder(),
        child: const Icon(Icons.swap_horizontal_circle_outlined, color: Colors.white, size: 30),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 6.0,
        color: Colors.white,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBottomTab(0, Icons.home_outlined, 'Home'),
              _buildBottomTab(1, Icons.receipt_long_outlined, 'My Orders'),
              const SizedBox(width: 40), // FAB Space spacer
              _buildBottomTab(3, Icons.headset_mic_outlined, 'Support'),
              _buildBottomTab(4, Icons.person_outline, 'Profile'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomTab(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return InkWell(
      onTap: () {
        setState(() {
          _currentIndex = index;
          if (index != 0) {
            _selectedCategory = null;
            _selectedBrand = null;
            _selectedModel = null;
          }
        });
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF0D9488) : Colors.grey, size: 22),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 9,
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                color: isSelected ? const Color(0xFF0D9488) : Colors.grey,
              ),
            )
          ],
        ),
      ),
    );
  }

  // 1. Home Tab View Builder
  Widget _buildHomeView() {
    if (_selectedModel != null) {
      if (_flowMode == 'buy') {
        return RefurbishedPurchaseWizard(
          model: _selectedModel!,
          user: _user,
          dio: _dio,
          onLoginRequired: _showLoginSheet,
          onComplete: (newOrder) {
            setState(() {
              _myOrders.insert(0, newOrder);
              _selectedModel = null;
              _selectedBrand = null;
              _selectedCategory = null;
              _currentIndex = 1; // Open Orders Tab
            });
          },
          onCancel: () => setState(() => _selectedModel = null),
        );
      }

      return AppraisalWizard(
        model: _selectedModel!,
        user: _user,
        questions: _questions,
        rules: _rules,
        dio: _dio,
        flowMode: _flowMode,
        onLoginRequired: _showLoginSheet,
        onComplete: (newOrder) {
          setState(() {
            _myOrders.insert(0, newOrder);
            _selectedModel = null;
            _selectedBrand = null;
            _selectedCategory = null;
            _currentIndex = 1; // Open Orders Tab
          });
        },
        onCancel: () => setState(() => _selectedModel = null),
      );
    }

    if (_selectedBrand != null) {
      final brandName = _selectedBrand['name'];
      final catName = _selectedCategory['name'];
      final brandModels = _models.where((m) {
        final mBrand = m['brand']?.toString().toLowerCase() ?? '';
        final mCat = m['category']?.toString().toLowerCase() ?? '';
        return mBrand == brandName.toLowerCase() &&
            (mCat.contains(catName.toLowerCase().replaceAll('sell ', '')) ||
                catName.toLowerCase().contains(mCat));
      }).toList();

      return _buildModelsGrid(brandModels);
    }

    if (_selectedCategory != null) {
      final catName = _selectedCategory['name'] as String;
      final cleanCat = catName.replaceAll('Sell ', '');

      final categoryBrands = _brands.where((b) {
        final List<dynamic> cats = b['categories'] ?? [];
        if (cats.isEmpty) return true; // Show by default if not specified
        final normalizedCat = cleanCat.toLowerCase();
        return cats.any((c) {
          final cStr = c.toString().toLowerCase();
          return cStr.contains(normalizedCat) ||
              normalizedCat.contains(cStr) ||
              (normalizedCat == 'phones' && cStr == 'smartphones') ||
              (normalizedCat == 'smartphones' && cStr == 'phones');
        });
      }).toList();

      return _buildBrandsGrid(categoryBrands);
    }

    // Default Main Feed Screen matching Mockup UI
    return RefreshIndicator(
      onRefresh: _fetchData,
      child: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          // Hero Card / Promo Banner matches mock exact gradient design
          Container(
            margin: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFE2F5EE), Color(0xFFF0FAF6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: const TextSpan(
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0C213A),
                            height: 1.25,
                          ),
                          children: [
                            TextSpan(text: 'Sell Your Device\nin '),
                            TextSpan(text: '60 Seconds', style: TextStyle(color: Color(0xFF0D9488))),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Get the best price instantly',
                        style: TextStyle(fontSize: 12, color: Colors.black54, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0C213A),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                          elevation: 0,
                        ),
                        onPressed: () {
                          setState(() {
                            _selectedCategory = null;
                            _currentIndex = 2; // Open sell flow
                          });
                        },
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Sell Now', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                            SizedBox(width: 6),
                            Icon(Icons.arrow_forward_ios, color: Colors.white, size: 9),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          SizedBox(
                            width: 42,
                            height: 18,
                            child: Stack(
                              children: [
                                Positioned(
                                  left: 0,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 1.5),
                                    ),
                                    child: const CircleAvatar(
                                      radius: 7,
                                      backgroundImage: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  left: 10,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 1.5),
                                    ),
                                    child: const CircleAvatar(
                                      radius: 7,
                                      backgroundImage: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  left: 20,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 1.5),
                                    ),
                                    child: const CircleAvatar(
                                      radius: 7,
                                      backgroundImage: NetworkImage('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50'),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('10L+ Happy Customers', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                              Text('Quick. Easy. Hassle-free.', style: TextStyle(fontSize: 8, color: Colors.grey.shade600, fontWeight: FontWeight.bold)),
                            ],
                          )
                        ],
                      )
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // Simulated Mock Phones Overlapping Image
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=250',
                    height: 140,
                    width: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Icon(Icons.phone_android, size: 80, color: Colors.grey),
                  ),
                )
              ],
            ),
          ),

          // "What would you like to do?" Section
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text('What would you like to do?', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildOptionCard('Sell', 'Old Device', Icons.phone_iphone, const Color(0xFFE8F8F5), const Color(0xFF16A085), () {
                  setState(() {
                    _flowMode = 'sell';
                    _currentIndex = 2; // Direct Sell Flow
                  });
                }),
                _buildOptionCard('Exchange', 'Get Better Value', Icons.swap_horiz, const Color(0xFFEBF5FB), const Color(0xFF2980B9), () {
                  setState(() {
                    _flowMode = 'exchange';
                    _currentIndex = 2;
                  });
                }),
                _buildOptionCard('Buy', 'Refurbished Devices', Icons.shopping_bag_outlined, const Color(0xFFFEF9E7), const Color(0xFFD35400), () {
                  setState(() {
                    _flowMode = 'buy';
                    _selectedCategory = null;
                    _selectedBrand = null;
                    _selectedModel = null;
                    _currentIndex = 2; // Open Category select in buy mode!
                  });
                }),
                _buildOptionCard('Find', 'Stolen Device', Icons.shield_outlined, const Color(0xFFF5EEF8), const Color(0xFF8E44AD), () {
                  _showStolenDeviceDialog();
                }),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Device Inspection Simulator Banner
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0C213A), Color(0xFF1F3A52)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  setState(() {
                    _flowMode = 'inspection';
                    _selectedCategory = null;
                    _selectedBrand = null;
                    _selectedModel = null;
                    _currentIndex = 2; // Jump to category select grid in inspection mode!
                  });
                },
                borderRadius: BorderRadius.circular(16),
                child: const Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(Icons.calculate_outlined, color: Colors.greenAccent, size: 28),
                      SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Device Inspection Calculator', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900)),
                            SizedBox(height: 2),
                            Text('Check the estimated value of any product instantly.', style: TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                      Icon(Icons.arrow_forward_ios, color: Colors.white, size: 12),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // 100% Safe & Secure Transactions Banner
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade100),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE8F5E9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.verified_user_outlined, color: Color(0xFF1ABC9C), size: 20),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('100% Safe & Secure Transactions', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                      SizedBox(height: 2),
                      Text('Doorstep pickup | Instant payment', style: TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios, color: Colors.grey, size: 12),
              ],
            ),
          ),

          // Search Bar Section
          Container(
            margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: TextField(
              onChanged: (val) {
                setState(() {
                  _refurbishedSearch = val;
                });
              },
              decoration: const InputDecoration(
                hintText: 'Search for mobiles, laptops & more...',
                hintStyle: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold),
                prefixIcon: Icon(Icons.search, color: Colors.grey),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),

          if (_refurbishedSearch.isNotEmpty) ...[
            _buildSearchResultsView(),
          ] else ...[
            // Popular Categories
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Popular Categories', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _flowMode = 'sell';
                        _currentIndex = 2;
                      });
                    },
                    child: const Text('View All >', style: TextStyle(color: Color(0xFF0D9488), fontSize: 11, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            ),

            // Categories horizontal layout
            SizedBox(
              height: 90,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: _categories.map((cat) {
                  final catName = cat['name'] as String;
                  String imgUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=150'; // default phone
                  if (catName.contains('Laptop')) {
                    imgUrl = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=150';
                  } else if (catName.contains('Tablet')) {
                    imgUrl = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=150';
                  } else if (catName.contains('Watch')) {
                    imgUrl = 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=150';
                  } else if (catName.contains('TV') || catName.contains('Console') || catName.contains('Audio')) {
                    imgUrl = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=150';
                  }

                  return InkWell(
                    onTap: () {
                      setState(() {
                        _flowMode = 'sell';
                        _selectedCategory = cat;
                        _currentIndex = 2; // Open sell flow
                      });
                    },
                    child: Container(
                      width: 75,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      child: Column(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.grey.shade100),
                              image: DecorationImage(image: NetworkImage(imgUrl), fit: BoxFit.cover),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            catName,
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          )
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Refurbished catalog list
            _buildRefurbishedCatalogView(),

            // How Cashifin Works? progress block
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade100),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('How Cashifin Works?', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Color(0xFF0C213A))),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildProgressStep('1', 'Select Device', 'Choose your\ndevice', Icons.phone_iphone),
                      const Icon(Icons.chevron_right, size: 14, color: Colors.grey),
                      _buildProgressStep('2', 'Get Instant Price', 'Answer few\nquestions & get', Icons.assignment_outlined),
                      const Icon(Icons.chevron_right, size: 14, color: Colors.grey),
                      _buildProgressStep('3', 'Free Pickup', 'We\'ll pickup\nfrom your home', Icons.local_shipping_outlined),
                      const Icon(Icons.chevron_right, size: 14, color: Colors.grey),
                      _buildProgressStep('4', 'Get Paid', 'Get paid\ninstantly', Icons.wallet_outlined),
                    ],
                  ),
                ],
              ),
            ),

            // Coupon reward bar matches mock
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF81C784).withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.card_giftcard, color: Color(0xFF0D9488), size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Get extra ₹500 bonus', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                        Text('on every successful sale', style: TextStyle(fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF0D9488), style: BorderStyle.solid),
                    ),
                    child: const Row(
                      children: [
                        Text(
                          'CASHIFIN500',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0D9488),
                            letterSpacing: 0.5,
                          ),
                        ),
                        SizedBox(width: 6),
                        Icon(Icons.copy, color: Color(0xFF0D9488), size: 10),
                      ],
                    ),
                  )
                ],
              ),
            ),

            // FAQ Section
            _buildFAQsView(),

            // Articles Section
            _buildArticlesView(),
          ],
        ],
      ),
    );
  }

  Widget _buildOptionCard(String title, String subtitle, IconData icon, Color bg, Color iconColor, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 80,
        height: 95,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade100),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
            Text(subtitle, style: TextStyle(fontSize: 7, color: Colors.grey.shade500, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressStep(String stepNum, String title, String desc, IconData icon) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFF0D9488).withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: const Color(0xFF0D9488), size: 18),
            ),
            Positioned(
              right: 0,
              top: 0,
              child: CircleAvatar(
                radius: 7,
                backgroundColor: const Color(0xFF0C213A),
                child: Text(
                  stepNum,
                  style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                ),
              ),
            )
          ],
        ),
        const SizedBox(height: 8),
        Text(title, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
        Text(desc, style: const TextStyle(fontSize: 6, color: Colors.grey, fontWeight: FontWeight.bold)),
      ],
    );
  }

  void _showStolenDeviceDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.shield_outlined, color: Colors.purple),
              SizedBox(width: 8),
              Text('Anti-Theft Scan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: const Text(
            'Anti-theft verification network active. By scheduling logistics check, your device IMEI database ledger verifies ownership automatically. Safe recommerce circle certified.',
            style: TextStyle(fontSize: 12, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
            )
          ],
        );
      },
    );
  }

  Widget _buildSearchResultsView() {
    final query = _refurbishedSearch.toLowerCase();
    final matchedModels = _models.where((m) {
      final name = m['name']?.toString().toLowerCase() ?? '';
      final brand = m['brand']?.toString().toLowerCase() ?? '';
      return name.contains(query) || brand.contains(query);
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Search Results (${matchedModels.length})', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Color(0xFF0C213A))),
              TextButton(onPressed: () => setState(() => _refurbishedSearch = ''), child: const Text('Clear', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.red))),
            ],
          ),
        ),
        if (matchedModels.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(32),
              child: Text('No devices match your search query.', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
            ),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.8),
            itemCount: matchedModels.length,
            itemBuilder: (context, index) {
              final m = matchedModels[index];
              return _buildModelGridCard(m);
            },
          ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildRefurbishedCatalogView() {
    final scopes = ['Smartphones', 'Laptops', 'Tablets'];
    final scopeFilteredModels = _models.where((m) {
      if (_refurbishedScope == null) return m['category'] == 'Smartphones';
      return m['category']?.toString().toLowerCase() == _refurbishedScope!.toLowerCase();
    }).take(6).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Text('Buy Refurbished Devices', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: scopes.map((s) {
              final isSelected = (_refurbishedScope == s || (_refurbishedScope == null && s == 'Smartphones'));
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(s, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                  selected: isSelected,
                  selectedColor: const Color(0xFF0D9488).withOpacity(0.15),
                  checkmarkColor: const Color(0xFF0D9488),
                  onSelected: (_) {
                    setState(() {
                      _refurbishedScope = s;
                    });
                  },
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.8),
          itemCount: scopeFilteredModels.length,
          itemBuilder: (context, index) {
            final m = scopeFilteredModels[index];
            return _buildModelGridCard(m);
          },
        ),
      ],
    );
  }

  Widget _buildModelGridCard(dynamic m) {
    return InkWell(
      onTap: () => setState(() => _selectedModel = m),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(
                  m['imageUrl'] ?? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade100, child: const Icon(Icons.devices, color: Colors.grey)),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(m['name'] ?? '', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)), textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(m['basePrice'] ?? '₹35,000', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0D9488))),
          ],
        ),
      ),
    );
  }

  Widget _buildFAQsView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Text('Frequently Asked Questions', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: _faqs.length,
          itemBuilder: (context, index) {
            final f = _faqs[index];
            return Card(
              color: Colors.white,
              elevation: 0,
              margin: const EdgeInsets.only(bottom: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade200)),
              child: ExpansionTile(
                title: Text(f['q'] ?? f['question'] ?? '', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0C213A))),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                    child: Text(f['a'] ?? f['answer'] ?? '', style: const TextStyle(fontSize: 11, color: Colors.grey, height: 1.4)),
                  )
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildArticlesView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Text('Resource Recommerce Blog', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
        ),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _articles.length,
            itemBuilder: (context, index) {
              final a = _articles[index];
              return Container(
                width: 260,
                margin: const EdgeInsets.only(right: 12, bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                        child: Image.network(
                          a['imageUrl'] ?? a['image'] ?? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300',
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade100, child: const Icon(Icons.article, color: Colors.grey)),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(a['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11, color: Color(0xFF0C213A)), maxLines: 1, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 4),
                          Text(a['desc'] ?? a['description'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 10, height: 1.3), maxLines: 2, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    )
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // 2. Brands Grid Selector
  Widget _buildBrandsGrid(List<dynamic> categoryBrands) {
    final catName = _selectedCategory['name'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => _selectedCategory = null)),
              Text('Sell Old $catName', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
            ],
          ),
        ),
        Expanded(
          child: categoryBrands.isEmpty
              ? const Center(child: Text('No brands matching this category.', style: TextStyle(fontWeight: FontWeight.bold)))
              : GridView.count(
                  crossAxisCount: 2,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.5,
                  children: categoryBrands.map((b) {
                    final brandName = b['name'] as String;
                    return InkWell(
                      onTap: () => setState(() => _selectedBrand = b),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Center(
                          child: Text(brandName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                        ),
                      ),
                    );
                  }).toList(),
                ),
        )
      ],
    );
  }

  // 3. Models Grid Selector
  Widget _buildModelsGrid(List<dynamic> models) {
    final brandName = _selectedBrand['name'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => _selectedBrand = null)),
              Expanded(
                child: Text('Select $brandName Model', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)), overflow: TextOverflow.ellipsis),
              ),
            ],
          ),
        ),
        Expanded(
          child: models.isEmpty
              ? const Center(child: Text('No models configured.', style: TextStyle(fontWeight: FontWeight.bold)))
              : GridView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.8),
                  itemCount: models.length,
                  itemBuilder: (context, index) {
                    final m = models[index];
                    return InkWell(
                      onTap: () => setState(() => _selectedModel = m),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: ClipRRect(borderRadius: BorderRadius.circular(10), child: Image.network(m['imageUrl'] ?? 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=200', fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade100, child: const Icon(Icons.devices, color: Colors.grey))))),
                            const SizedBox(height: 8),
                            Text(m['name'] ?? '', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)), textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis),
                            const SizedBox(height: 4),
                            Text(m['basePrice'] ?? '₹35,000', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0D9488))),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        )
      ],
    );
  }

  // Direct Sell Flow View
  Widget _buildSellNowDirectView() {
    String title = 'Sell Your Device';
    if (_flowMode == 'buy') title = 'Buy Refurbished Devices';
    if (_flowMode == 'exchange') title = 'Exchange Your Device';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
        ),
        Expanded(
          child: GridView.count(
            crossAxisCount: 2,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: _categories.map((cat) {
              final catName = cat['name'] as String;
              IconData icon = Icons.phone_android;
              if (catName.contains('Laptop')) icon = Icons.laptop;
              if (catName.contains('Tablet')) icon = Icons.tablet_android;
              if (catName.contains('Watch')) icon = Icons.watch;
              if (catName.contains('TV')) icon = Icons.tv;
              if (catName.contains('Console')) icon = Icons.videogame_asset;

              return InkWell(
                onTap: () {
                  setState(() {
                    _selectedCategory = cat;
                    _selectedBrand = null;
                    _selectedModel = null;
                    _currentIndex = 0; // Return to Home to show child flows
                  });
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFF0D9488).withOpacity(0.08), shape: BoxShape.circle),
                        child: Icon(icon, color: const Color(0xFF0D9488), size: 28),
                      ),
                      const SizedBox(height: 10),
                      Text(catName, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        )
      ],
    );
  }

  // 4. Bookings View Tab
  Widget _buildOrdersView() {
    if (_user == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.receipt_long, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text('Access Your Bookings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              const Text('Log in with your phone number to check pending doorstep pickup orders.', style: TextStyle(color: Colors.grey, fontSize: 12), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                onPressed: _showLoginSheet,
                child: const Text('Log In Now', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      );
    }

    if (_myOrders.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.checklist_rtl, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('No Bookings Found', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0C213A))),
            SizedBox(height: 6),
            Text('Schedule your first doorstep evaluation device.', style: TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _myOrders.length,
      itemBuilder: (context, index) {
        final o = _myOrders[index];
        return Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
          elevation: 0,
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(o['id'] ?? 'ORD-XXXX', style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: const Color(0xFF0D9488).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                      child: Text(o['status'] ?? 'Scheduled', style: const TextStyle(color: Color(0xFF0D9488), fontSize: 10, fontWeight: FontWeight.w900)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(o['device'] ?? '', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF0C213A))),
                const SizedBox(height: 4),
                Text('Payout: ${o['price']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0D9488))),
                const Divider(height: 20),
                Text('📅 Slot: ${o['slot'] ?? 'Tomorrow, 10:00 AM - 01:00 PM'}', style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        );
      },
    );
  }

  // 5. Support Tab View
  Widget _buildSupportView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Icon(Icons.support_agent, size: 60, color: Color(0xFF0D9488)),
        const SizedBox(height: 12),
        const Center(
          child: Text('Cashifin Support Center', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF0C213A))),
        ),
        const Center(
          child: Text('We are available 24/7 to inspect and resolve valuations.', style: TextStyle(color: Colors.grey, fontSize: 12)),
        ),
        const SizedBox(height: 20),
        Card(
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade100)),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.phone, color: Color(0xFF0D9488)),
                  title: const Text('Hotline Phone Support', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  subtitle: const Text('1800-123-4567 (Toll-Free)', style: TextStyle(fontSize: 11)),
                  onTap: () {},
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.email, color: Color(0xFF0D9488)),
                  title: const Text('Official Operations Support', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  subtitle: const Text('support@cashifin.in', style: TextStyle(fontSize: 11)),
                  onTap: () {},
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.location_on, color: Color(0xFF0D9488)),
                  title: const Text('Headquarters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  subtitle: const Text('Sector 62, Noida, Uttar Pradesh, India', style: TextStyle(fontSize: 11)),
                  onTap: () {},
                )
              ],
            ),
          ),
        )
      ],
    );
  }

  // 6. User Profile View Tab
  Widget _buildProfileView() {
    if (_user == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.account_circle, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text('Manage Profile Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              const Text('Save addresses and track instant circular payouts.', style: TextStyle(color: Colors.grey, fontSize: 12), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                onPressed: _showLoginSheet,
                child: const Text('Access Account', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      );
    }

    final name = _user!['name'] ?? 'Adarsh Sachan';
    final initials = name.split(' ').map((n) => n.isNotEmpty ? n[0] : '').join().toUpperCase();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: Column(
            children: [
              CircleAvatar(radius: 35, backgroundColor: const Color(0xFF0D9488), child: Text(initials.isNotEmpty ? initials : 'AS', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold))),
              const SizedBox(height: 8),
              Text(name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF0C213A))),
              Text(_user!['phone'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const SizedBox(height: 24),
        _buildProfileTile(Icons.email, 'Email Address', _user!['email'] ?? 'user@cashifin.in'),
        _buildProfileTile(Icons.home, 'Saved Addresses', _user!['address'] ?? 'No Saved Addresses'),
        _buildProfileTile(Icons.info, 'About Cashifin Circularity', 'v1.0.0 Stable Release'),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: Colors.red),
              foregroundColor: Colors.red,
            ),
            icon: const Icon(Icons.logout),
            label: const Text('Logout', style: TextStyle(fontWeight: FontWeight.bold)),
            onPressed: () async {
              await _saveUserSession(null);
              setState(() {
                _myOrders = [];
                _currentIndex = 0;
              });
            },
          ),
        )
      ],
    );
  }

  Widget _buildProfileTile(IconData icon, String title, String val) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF0D9488)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: Color(0xFF0C213A))),
      subtitle: Text(val, style: const TextStyle(fontSize: 11, color: Colors.grey)),
    );
  }
}

// Appraisal & Survey Wizard Page Component
class AppraisalWizard extends StatefulWidget {
  final Map<String, dynamic> model;
  final Map<String, dynamic>? user;
  final List<dynamic> questions;
  final List<dynamic> rules;
  final Dio dio;
  final String flowMode;
  final VoidCallback onLoginRequired;
  final Function(Map<String, dynamic>) onComplete;
  final VoidCallback onCancel;

  const AppraisalWizard({
    super.key,
    required this.model,
    required this.user,
    required this.questions,
    required this.rules,
    required this.dio,
    required this.flowMode,
    required this.onLoginRequired,
    required this.onComplete,
    required this.onCancel,
  });

  @override
  State<AppraisalWizard> createState() => _AppraisalWizardState();
}

class _AppraisalWizardState extends State<AppraisalWizard> {
  int _wizardStep = 1; // 1: Diagnostics, 2: Checkout, 3: Success
  final Map<String, String> _answers = {};
  List<dynamic> _matchingQuestions = [];

  // Checkout inputs
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  String _pickupSlot = 'Tomorrow, 10:00 AM - 01:00 PM';

  @override
  void initState() {
    super.initState();
    _filterQuestions();
    if (widget.user != null) {
      _nameController.text = widget.user!['name'] ?? '';
      _phoneController.text = widget.user!['phone'] ?? '';
      _addressController.text = widget.user!['address'] ?? '';
    }
  }

  void _filterQuestions() {
    final catName = widget.model['category']?.toString().toLowerCase() ?? '';
    final brandName = widget.model['brand']?.toString().toLowerCase() ?? '';
    final modelName = widget.model['name']?.toString().toLowerCase() ?? '';

    setState(() {
      _matchingQuestions = widget.questions.where((q) {
        // Filter questions by Category
        final List<dynamic> qCats = q['categories'] ?? [];
        final matchesCat = qCats.isEmpty || qCats.any((c) => catName.contains(c.toString().toLowerCase()) || c.toString().toLowerCase().contains(catName));

        // Filter questions by Brand
        final List<dynamic> qBrands = q['brands'] ?? [];
        final matchesBrand = qBrands.isEmpty || qBrands.any((b) => brandName.contains(b.toString().toLowerCase()) || b.toString().toLowerCase().contains(brandName));

        // Filter questions by Model
        final List<dynamic> qModels = q['models'] ?? [];
        final matchesModel = qModels.isEmpty || qModels.any((m) => modelName.contains(m.toString().toLowerCase()) || m.toString().toLowerCase().contains(modelName));

        return matchesCat && matchesBrand && matchesModel;
      }).toList();

      // If no questions apply, fall back to standard list
      if (_matchingQuestions.isEmpty) {
        _matchingQuestions = widget.questions;
      }

      // Initialize default answers
      for (final q in _matchingQuestions) {
        final text = q['text'] ?? '';
        final List<dynamic> options = q['options'] ?? [];
        if (options.isNotEmpty && !_answers.containsKey(text)) {
          _answers[text] = options[0]['optionText'] ?? 'Perfect';
        }
      }
    });
  }

  int _calculateQuote() {
    int base = widget.model['rawBase'] ?? 35000;
    int runningPrice = base;

    // 1. Evaluate Question Option Deductions
    _answers.forEach((qText, selectedOptionText) {
      final question = _matchingQuestions.firstWhere(
        (q) => q['text'] == qText,
        orElse: () => null,
      );
      if (question != null) {
        final List<dynamic> options = question['options'] ?? [];
        final option = options.firstWhere(
          (opt) => opt['optionText']?.toString().toLowerCase() == selectedOptionText.toLowerCase(),
          orElse: () => null,
        );
        if (option != null) {
          int impact = 0;
          final deductionType = option['deductionType']?.toString().toLowerCase();
          final val = (option['deductionValue'] as num?)?.toInt() ?? 0;

          if (deductionType == 'flat') {
            impact = val;
          } else if (deductionType == 'percentage') {
            impact = ((runningPrice * val) / 100).round();
          }
          runningPrice -= impact;
        }
      }
    });

    // 2. Evaluate Dynamic Pricing Rules from DB
    for (final rule in widget.rules) {
      final condStr = rule['condition']?.toString() ?? '';
      final deductionStr = rule['deduction']?.toString() ?? '';

      // Parse rule like: IF "Battery Health" is "Below 80%"
      final RegExp reg = RegExp(r'IF "(.*)" is "(.*)"');
      final match = reg.firstMatch(condStr);
      if (match != null) {
        final ruleQ = match.group(1);
        final ruleA = match.group(2);
        if (_answers[ruleQ]?.toLowerCase() == ruleA?.toLowerCase()) {
          // Parse flat or percentage deduction
          final flatMatch = RegExp(r'Reduce ₹([\d,]+)').firstMatch(deductionStr);
          if (flatMatch != null) {
            final val = int.parse(flatMatch.group(1)!.replaceAll(',', ''));
            runningPrice -= val;
          }
          final pctMatch = RegExp(r'Reduce (\d+)%').firstMatch(deductionStr);
          if (pctMatch != null) {
            final pct = int.parse(pctMatch.group(1)!);
            runningPrice -= ((base * pct) / 100).round();
          }
        }
      }
    }

    final minPrice = widget.model['rawMin'] ?? 3000;
    return runningPrice < minPrice ? minPrice : runningPrice;
  }

  Future<void> _handlePlaceOrder() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final address = _addressController.text.trim();

    if (name.isEmpty || phone.isEmpty || address.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete all contact details.')),
      );
      return;
    }

    final quote = _calculateQuote();
    final orderId = 'ORD-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';

    final newOrder = {
      'id': orderId,
      'customer': name,
      'phone': phone,
      'device': '${widget.model['name']} (${widget.model['brand']})',
      'price': '₹${quote.toLocaleString()}',
      'status': 'Pending',
      'partner': 'Rohit Sharma',
      'date': '08 Aug 2026'
    };

    final newPickup = {
      'orderId': orderId,
      'slot': _pickupSlot,
      'address': address,
      'distance': '3.8 KM',
      'partner': 'Rohit Sharma',
      'status': 'Scheduled'
    };

    try {
      // Place Order
      await widget.dio.post(
        '$apiBaseUrl/orders',
        data: {'action': 'create', 'item': newOrder},
      );
      // Place Pickup Schedule
      await widget.dio.post(
        '$apiBaseUrl/pickups',
        data: {'action': 'create', 'item': newPickup},
      );

      // Play system chime notification sound
      SystemSound.play(SystemSoundType.click);

      // Trigger notifications for Admin, Partner, and Customer
      final dateStr = newOrder['date'] as String;
      await widget.dio.post(
        '$apiBaseUrl/notifications',
        data: {
          'action': 'create',
          'item': {
            'id': 'NTF-${DateTime.now().millisecondsSinceEpoch}-adm',
            'target': 'admin',
            'message': 'New Buyback order placed via App: $orderId for ${widget.model['name']}',
            'read': false,
            'date': dateStr
          }
        },
      ).catchError((e) => debugPrint('Admin notification post error: $e'));

      await widget.dio.post(
        '$apiBaseUrl/notifications',
        data: {
          'action': 'create',
          'item': {
            'id': 'NTF-${DateTime.now().millisecondsSinceEpoch}-part',
            'target': 'partner',
            'message': 'New Buyback pickup assigned: $orderId via App',
            'read': false,
            'date': dateStr
          }
        },
      ).catchError((e) => debugPrint('Partner notification post error: $e'));

      await widget.dio.post(
        '$apiBaseUrl/notifications',
        data: {
          'action': 'create',
          'item': {
            'id': 'NTF-${DateTime.now().millisecondsSinceEpoch}-cust',
            'target': phone,
            'message': 'Your Buyback order $orderId has been placed successfully!',
            'read': false,
            'date': dateStr
          }
        },
      ).catchError((e) => debugPrint('Customer notification post error: $e'));
    } catch (e) {
      debugPrint('Error placing booking in DB: $e');
    }

    setState(() => _wizardStep = 3);
  }

  @override
  Widget build(BuildContext context) {
    if (_wizardStep == 1) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(icon: const Icon(Icons.arrow_back), onPressed: widget.onCancel),
                Expanded(
                  child: Text(
                    'Appraise: ${widget.model['name']}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _matchingQuestions.length,
                itemBuilder: (context, index) {
                  final q = _matchingQuestions[index];
                  final text = q['text'] ?? '';
                  final List<dynamic> options = q['options'] ?? [];
                  final currentAns = _answers[text] ?? '';

                  return Card(
                    color: Colors.white,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade300)),
                    elevation: 0,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(text, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: Color(0xFF0C213A))),
                          const SizedBox(height: 8),
                          Row(
                            children: options.map((opt) {
                              final optText = opt['optionText'] ?? '';
                              final active = currentAns.toLowerCase() == optText.toString().toLowerCase();
                              return Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 4),
                                  child: OutlinedButton(
                                    style: OutlinedButton.styleFrom(
                                      backgroundColor: active ? const Color(0xFF0D9488).withOpacity(0.1) : Colors.white,
                                      side: BorderSide(color: active ? const Color(0xFF0D9488) : Colors.grey.shade300),
                                      padding: const EdgeInsets.symmetric(vertical: 4),
                                    ),
                                    onPressed: () => setState(() => _answers[text] = optText),
                                    child: Text(optText, style: TextStyle(color: active ? const Color(0xFF0D9488) : Colors.black87, fontWeight: FontWeight.bold, fontSize: 10)),
                                  ),
                                ),
                              );
                            }).toList(),
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: const Color(0xFF0C213A), borderRadius: BorderRadius.circular(16)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('EST. PAYOUT', style: TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.bold)),
                      Text('₹${_calculateQuote().toLocaleString()}', style: const TextStyle(color: Colors.greenAccent, fontSize: 18, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                    onPressed: () {
                      if (widget.flowMode == 'inspection') {
                        setState(() => _wizardStep = 4);
                      } else if (widget.user == null) {
                        widget.onLoginRequired();
                      } else {
                        setState(() => _wizardStep = 2);
                      }
                    },
                    child: Text(widget.flowMode == 'inspection' ? 'Get Report →' : 'Checkout →', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            )
          ],
        ),
      );
    }

    if (_wizardStep == 4) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.calculate_outlined, size: 70, color: Color(0xFF0D9488)),
            const SizedBox(height: 16),
            const Text('Inspection Valuation', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
            const SizedBox(height: 8),
            Text(
              'The estimated buyback/exchange value of ${widget.model['name']} has been calculated.',
              style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                color: const Color(0xFFE8F5E9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF0D9488)),
              ),
              child: Column(
                children: [
                  const Text('ESTIMATED DEVICE VALUE', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('₹${_calculateQuote().toLocaleString()}', style: const TextStyle(color: Color(0xFF0D9488), fontSize: 24, fontWeight: FontWeight.w950)),
                ],
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                onPressed: () {
                  widget.onCancel(); // Reset flow back to home!
                },
                child: const Text('Check Another Product', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      );
    }

    if (_wizardStep == 2) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Row(
              children: [
                IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => _wizardStep = 1)),
                const Text('Doorstep Pickup Details', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              color: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(labelText: 'Customer Name', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _phoneController,
                      decoration: const InputDecoration(labelText: 'Contact Phone', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _addressController,
                      maxLines: 2,
                      decoration: const InputDecoration(labelText: 'Pickup Address Details', border: OutlineInputBorder()),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Choose Evaluation Slot', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0C213A))),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _pickupSlot,
              decoration: const InputDecoration(border: OutlineInputBorder(), fillColor: Colors.white, filled: true),
              items: [
                'Tomorrow, 10:00 AM - 01:00 PM',
                'Tomorrow, 02:00 PM - 05:00 PM',
                'Day After, 10:00 AM - 01:00 PM',
                'Day After, 02:00 PM - 05:00 PM',
              ].map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 12)))).toList(),
              onChanged: (val) => setState(() => _pickupSlot = val!),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: const Color(0xFF0C213A), borderRadius: BorderRadius.circular(16)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('CONFIRMED PAYOUT', style: TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.bold)),
                      Text('₹${_calculateQuote().toLocaleString()}', style: const TextStyle(color: Colors.greenAccent, fontSize: 18, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                    onPressed: _handlePlaceOrder,
                    child: const Text('Book Order', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            )
          ],
        ),
      );
    }

    // Success Screen
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.verified, size: 70, color: Color(0xFF0D9488)),
          const SizedBox(height: 16),
          const Text('Evaluation Booked!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
          const SizedBox(height: 8),
          Text(
            'Your device doorstep evaluation pickup has been successfully registered at ₹${_calculateQuote().toLocaleString()}. An inspector will contact you shortly.',
            style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              onPressed: () {
                widget.onComplete({
                  'id': 'ORD-CONFIRMED',
                  'device': '${widget.model['name']}',
                  'price': '₹${_calculateQuote().toLocaleString()}',
                  'status': 'Scheduled',
                  'slot': _pickupSlot
                });
              },
              child: const Text('Back to Bookings', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          )
        ],
      ),
    );
  }
}

// Utility extension for local currency formatting
extension IntFormatting on int {
  String toLocaleString() {
    final str = toString();
    if (str.length <= 3) return str;
    final lastThree = str.substring(str.length - 3);
    final otherNumbers = str.substring(0, str.length - 3);
    var formatted = '';
    var count = 0;
    for (var i = otherNumbers.length - 1; i >= 0; i--) {
      formatted = otherNumbers[i] + formatted;
      count++;
      if (count == 2 && i != 0) {
        formatted = ',$formatted';
        count = 0;
      }
    }
    return '$formatted,$lastThree';
  }
}

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;
  const OnboardingScreen({super.key, required this.onComplete});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _slideIndex = 0;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Sell in 60 Seconds',
      'desc': 'Answer a few simple questions about your device to get an instant, guaranteed valuation quote.',
      'icon': '⏱️',
      'image': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300'
    },
    {
      'title': 'Free Doorstep Verification',
      'desc': 'Our certified inspection partner arrives at your home or office to verify condition and pick it up.',
      'icon': '🚚',
      'image': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300'
    },
    {
      'title': 'Instant Cash Payout',
      'desc': 'Get paid immediately in your preferred bank account or wallet as soon as the evaluation is complete.',
      'icon': '💰',
      'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300'
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Logo
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      image: DecorationImage(
                        image: NetworkImage('http://localhost:3002/logo.jpg'),
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'cashifin',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0C213A),
                      letterSpacing: -0.8,
                    ),
                  ),
                ],
              ),
              Expanded(
                child: PageView.builder(
                  controller: _controller,
                  onPageChanged: (idx) {
                    setState(() {
                      _slideIndex = idx;
                    });
                  },
                  itemCount: _slides.length,
                  itemBuilder: (context, idx) {
                    final slide = _slides[idx];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(24),
                          child: Image.network(
                            slide['image']!,
                            height: 220,
                            width: 220,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          slide['icon']!,
                          style: const TextStyle(fontSize: 48),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          slide['title']!,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0C213A),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          slide['desc']!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    );
                  },
                ),
              ),
              // Dots & Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: List.generate(_slides.length, (i) {
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _slideIndex == i ? 18 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: _slideIndex == i ? const Color(0xFF0D9488) : Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      );
                    }),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      if (_slideIndex == _slides.length - 1) {
                        widget.onComplete();
                      } else {
                        _controller.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeIn,
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0D9488),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(_slideIndex == _slides.length - 1 ? 'Get Started' : 'Next'),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}

class RefurbishedPurchaseWizard extends StatefulWidget {
  final Map<String, dynamic> model;
  final Map<String, dynamic>? user;
  final Dio dio;
  final VoidCallback onLoginRequired;
  final Function(Map<String, dynamic>) onComplete;
  final VoidCallback onCancel;

  const RefurbishedPurchaseWizard({
    super.key,
    required this.model,
    required this.user,
    required this.dio,
    required this.onLoginRequired,
    required this.onComplete,
    required this.onCancel,
  });

  @override
  State<RefurbishedPurchaseWizard> createState() => _RefurbishedPurchaseWizardState();
}

class _RefurbishedPurchaseWizardState extends State<RefurbishedPurchaseWizard> {
  int _wizardStep = 1; // 1: Review, 2: Checkout, 3: Success
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  String _paymentMethod = 'Cash on Delivery';

  @override
  void initState() {
    super.initState();
    if (widget.user != null) {
      _nameController.text = widget.user!['name'] ?? '';
      _phoneController.text = widget.user!['phone'] ?? '';
      _addressController.text = widget.user!['address'] ?? '';
    }
  }

  Future<void> _handlePlaceOrder() async {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final address = _addressController.text.trim();

    if (name.isEmpty || phone.isEmpty || address.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please complete delivery details.')),
      );
      return;
    }

    final orderId = 'PUR-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';

    final newOrder = {
      'id': orderId,
      'customer': name,
      'phone': phone,
      'device': '${widget.model['name']} (${widget.model['brand']})',
      'price': widget.model['basePrice'] ?? widget.model['price'] ?? '₹18,500',
      'status': 'Processing',
      'partner': 'Cashifin Store',
      'date': '08 Aug 2026',
      'type': 'Purchase',
      'payment': _paymentMethod,
      'address': address
    };

    try {
      // Place Order
      await widget.dio.post(
        '$apiBaseUrl/orders',
        data: {'action': 'create', 'item': newOrder},
      );

      // Post notification to backend
      final dateStr = '08 Aug 2026';
      await widget.dio.post(
        '$apiBaseUrl/notifications',
        data: {
          'action': 'create',
          'item': {
            'id': 'NTF-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
            'target': 'admin',
            'message': 'New Purchase order $orderId placed by $name!',
            'read': false,
            'date': dateStr
          }
        },
      ).catchError((e) => debugPrint('Purchase notification post error: $e'));
    } catch (e) {
      debugPrint('Error placing purchase order in DB: $e');
    }

    setState(() => _wizardStep = 3);
  }

  @override
  Widget build(BuildContext context) {
    if (_wizardStep == 1) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(icon: const Icon(Icons.arrow_back), onPressed: widget.onCancel),
                Expanded(
                  child: Text(
                    'Buy: ${widget.model['name']}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        widget.model['imageUrl'] ?? widget.model['image'] ?? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=250',
                        height: 180,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.model['name'] ?? '',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0C213A)),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.model['basePrice'] ?? widget.model['price'] ?? '₹18,500',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0D9488)),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  const Text('Device Benefits & Certification', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Color(0xFF0C213A))),
                  const SizedBox(height: 12),
                  _buildBenefitRow(Icons.check_circle_outline, '32-point Quality Checklist Passed'),
                  _buildBenefitRow(Icons.verified_outlined, '6 Months Brand Warranty included'),
                  _buildBenefitRow(Icons.local_shipping_outlined, 'Free Doorstep Delivery in 24 hours'),
                  _buildBenefitRow(Icons.currency_exchange_outlined, '7-Days Replacement policy'),
                ],
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                onPressed: () {
                  if (widget.user == null) {
                    widget.onLoginRequired();
                  } else {
                    setState(() => _wizardStep = 2);
                  }
                },
                child: const Text('Proceed to Buy', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      );
    }

    if (_wizardStep == 2) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => _wizardStep = 1)),
                const Text('Delivery & Checkout', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
              ],
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView(
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Recipient Name', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(labelText: 'Contact Phone', border: OutlineInputBorder()),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _addressController,
                    decoration: const InputDecoration(labelText: 'Shipping Address', border: OutlineInputBorder()),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 16),
                  const Text('Payment Mode', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0C213A))),
                  ListTile(
                    title: const Text('Cash on Delivery', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    leading: Radio(
                      value: 'Cash on Delivery',
                      groupValue: _paymentMethod,
                      onChanged: (val) => setState(() => _paymentMethod = val!),
                    ),
                  ),
                  ListTile(
                    title: const Text('Pay Online / UPI', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    leading: Radio(
                      value: 'Online UPI',
                      groupValue: _paymentMethod,
                      onChanged: (val) => setState(() => _paymentMethod = val!),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                onPressed: _handlePlaceOrder,
                child: const Text('Place Purchase Order', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            )
          ],
        ),
      );
    }

    // Success Step
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.verified, size: 70, color: Color(0xFF0D9488)),
          const SizedBox(height: 16),
          const Text('Purchase Ordered!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0C213A))),
          const SizedBox(height: 8),
          const Text(
            'Your refurbished device purchase order has been placed successfully. A delivery executive will contact you shortly for shipping verification.',
            style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w600),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              onPressed: () {
                widget.onComplete({
                  'id': 'PUR-ORDER',
                  'device': '${widget.model['name']}',
                  'price': widget.model['basePrice'] ?? widget.model['price'] ?? '₹18,500',
                  'status': 'Processing',
                  'slot': 'Home Delivery'
                });
              },
              child: const Text('Back to Orders', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBenefitRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF0D9488), size: 18),
          const SizedBox(width: 8),
          Text(text, style: const TextStyle(fontSize: 12, color: Colors.black87, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

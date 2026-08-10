import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

class CashifyPartnerApp extends StatelessWidget {
  const CashifyPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cashifin Partner Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF39B54A),
          primary: const Color(0xFF39B54A),
          secondary: const Color(0xFF0C213A),
          surface: const Color(0xFFF8FAFC),
        ),
      ),
      home: const PartnerTabContainer(),
    );
  }
}

class PartnerTabContainer extends StatefulWidget {
  const PartnerTabContainer({super.key});

  @override
  State<PartnerTabContainer> createState() => _PartnerTabContainerState();
}

class _PartnerTabContainerState extends State<PartnerTabContainer> {
  int _currentIndex = 0;
  bool _isLoading = true;
  bool _showOnboarding = true;

  // Active Partner Details
  final String _partnerId = 'PTN-101';
  final String _partnerName = 'Rohit Sharma';
  String _partnerStatus = 'Online';
  final String _partnerZone = 'New Delhi (South)';
  final String _partnerRating = '4.9';
  double _walletBalance = 8450.0;
  List<dynamic> _pickups = [];
  List<dynamic> _orders = [];
  List<dynamic> _questions = [];
  List<dynamic> _categories = [];
  List<dynamic> _brands = [];
  List<dynamic> _models = [];

  // Active Inspection Flow Selections
  dynamic _selectedOrderForInspection;
  Map<int, String> _inspectionAnswers = {};
  double _inspectedValuation = 0.0;

  // Simulator Mode State Fields for checking value anytime
  bool _isValuationSimulatorMode = false;
  dynamic _simCategory;
  dynamic _simBrand;
  dynamic _simModel;
  Map<int, String> _simAnswers = {};
  double _simValuation = 0.0;

  final Dio _dio = Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 5),
  ));

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _showOnboarding = !(prefs.getBool('partner_onboarding_complete') ?? false);
      });
    } catch (_) {}

    try {
      // 1. Fetch Pickups
      final pickupsRes = await _dio.get('$apiBaseUrl/pickups');
      if (pickupsRes.statusCode == 200) {
        _pickups = pickupsRes.data is List ? pickupsRes.data : [];
      }

      // 2. Fetch Orders
      final ordersRes = await _dio.get('$apiBaseUrl/orders');
      if (ordersRes.statusCode == 200) {
        _orders = ordersRes.data is List ? ordersRes.data : [];
      }

      // 3. Fetch Questions
      final questionsRes = await _dio.get('$apiBaseUrl/questions');
      if (questionsRes.statusCode == 200) {
        _questions = questionsRes.data is List ? questionsRes.data : [];
      }

      // 4. Fetch Categories
      final catsRes = await _dio.get('$apiBaseUrl/categories');
      if (catsRes.statusCode == 200) {
        _categories = catsRes.data is List ? catsRes.data : [];
      }

      // 5. Fetch Brands
      final brandsRes = await _dio.get('$apiBaseUrl/brands');
      if (brandsRes.statusCode == 200) {
        _brands = brandsRes.data is List ? brandsRes.data : [];
      }

      // 6. Fetch Models
      final modelsRes = await _dio.get('$apiBaseUrl/models');
      if (modelsRes.statusCode == 200) {
        _models = modelsRes.data is List ? modelsRes.data : [];
      }
    } catch (e) {
      debugPrint('Error fetching data: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _playChime() {
    SystemSound.play(SystemSoundType.click);
  }

  Future<void> _updatePickupStatus(String orderId, String nextStatus) async {
    final target = _pickups.firstWhere((p) => p['orderId'] == orderId, orElse: () => null);
    if (target == null) return;

    final updated = Map<String, dynamic>.from(target);
    updated['status'] = nextStatus;

    try {
      await _dio.post(
        '$apiBaseUrl/pickups',
        data: {
          'action': 'update',
          'item': updated,
        },
      );
      _playChime();
      _fetchData();
    } catch (e) {
      debugPrint('Error updating status: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF39B54A)),
        ),
      );
    }

    if (_showOnboarding) {
      return PartnerOnboardingScreen(
        onComplete: () async {
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setBool('partner_onboarding_complete', true);
          } catch (_) {}
          setState(() {
            _showOnboarding = false;
          });
        },
      );
    }

    final pages = [
      _buildDashboardTab(),
      _buildPickupsTab(),
      _buildInspectionTab(),
      _buildWalletTab(),
      _buildSettingsTab(),
    ];

    return Scaffold(
      body: pages[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) {
          setState(() {
            _currentIndex = idx;
          });
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.local_shipping_outlined), selectedIcon: Icon(Icons.local_shipping), label: 'Pickups'),
          NavigationDestination(icon: Icon(Icons.fact_check_outlined), selectedIcon: Icon(Icons.fact_check), label: 'Inspect'),
          NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), selectedIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: DASHBOARD
  // ==========================================
  Widget _buildDashboardTab() {
    final activePickups = _pickups.where((p) => p['status'] != 'Completed' && p['status'] != 'Paid').toList();
    final completedCount = _pickups.where((p) => p['status'] == 'Completed' || p['status'] == 'Paid').length;

    return Scaffold(
      appBar: AppBar(
        title: Row(
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
            const SizedBox(width: 8),
            Text('Hello, $_partnerName', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchData),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status and Rating Bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Chip(
                  label: Text(_partnerStatus.toUpperCase()),
                  backgroundColor: _partnerStatus == 'Online' ? Colors.green.shade50 : Colors.red.shade50,
                  labelStyle: TextStyle(
                    color: _partnerStatus == 'Online' ? const Color(0xFF39B54A) : Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 20),
                    const SizedBox(width: 4),
                    Text(_partnerRating, style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Performance Cards Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.4,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildStatCard('Wallet Balance', '₹${_walletBalance.toStringAsFixed(0)}', Icons.account_balance_wallet, Colors.green),
                _buildStatCard('Active Jobs', '${activePickups.length} Pickups', Icons.pending_actions, Colors.blue),
                _buildStatCard('Completed', '$completedCount Jobs', Icons.check_circle_outline, Colors.purple),
                _buildStatCard('Zone Area', _partnerZone.split(' ')[0], Icons.map_outlined, Colors.orange),
              ],
            ),
            const SizedBox(height: 24),

            // Custom Sparkline Chart Panel
            const Text('Earnings Performance', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              height: 140,
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: CustomPaint(
                painter: _SparklinePainter(),
              ),
            ),
            const SizedBox(height: 24),

            // Quick Actions & Active Pickups summary
            const Text('Upcoming Active Pickups', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            if (activePickups.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 32),
                  child: Text('No active pickups assigned', style: TextStyle(color: Colors.grey)),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activePickups.length,
                itemBuilder: (context, idx) {
                  final pickup = activePickups[idx];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    elevation: 0,
                    child: ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Color(0xFF39B54A),
                        child: Icon(Icons.location_on, color: Colors.white),
                      ),
                      title: Text(pickup['address'] ?? 'Gurgaon', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(pickup['slot'] ?? '10:00 AM - 1:00 PM', style: const TextStyle(fontSize: 11)),
                      trailing: Text(pickup['status'] ?? 'Scheduled', style: const TextStyle(color: Color(0xFF39B54A), fontWeight: FontWeight.bold)),
                      onTap: () {
                        setState(() {
                          _currentIndex = 1; // Go to pickups tab
                        });
                      },
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(color: Colors.grey.shade500, fontSize: 11, fontWeight: FontWeight.bold)),
              Icon(icon, color: color, size: 20),
            ],
          ),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 2: PICKUPS LIST (INCOMING / ASSIGNED)
  // ==========================================
  Widget _buildPickupsTab() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Assigned Pickups', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: _pickups.isEmpty
          ? const Center(child: Text('No pickups assigned to your account.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _pickups.length,
              itemBuilder: (context, idx) {
                final pickup = _pickups[idx];
                final bool isCompleted = pickup['status'] == 'Completed' || pickup['status'] == 'Paid';

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.grey.shade200),
                  ),
                  elevation: 0,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Order: ${pickup['orderId']}',
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isCompleted ? Colors.green.shade50 : Colors.blue.shade50,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                pickup['status'] ?? 'Assigned',
                                style: TextStyle(
                                  color: isCompleted ? const Color(0xFF39B54A) : Colors.blue,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),
                        Row(
                          children: [
                            const Icon(Icons.access_time, size: 16, color: Colors.grey),
                            const SizedBox(width: 8),
                            Text(pickup['slot'] ?? '', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.location_on_outlined, size: 16, color: Colors.grey),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                pickup['address'] ?? '',
                                style: const TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        if (!isCompleted)
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {
                                    _updatePickupStatus(pickup['orderId'], 'Rejected');
                                  },
                                  style: OutlinedButton.styleFrom(
                                    side: const BorderSide(color: Colors.red),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: const Text('Reject', style: TextStyle(color: Colors.red)),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    setState(() {
                                      // Set order context for inspection
                                      final orderMatch = _orders.firstWhere((o) => o['id'] == pickup['orderId'], orElse: () => null);
                                      _selectedOrderForInspection = orderMatch ?? {
                                        'id': pickup['orderId'],
                                        'device': 'Smartphones Generic Device',
                                        'price': '₹12,000',
                                        'rawBase': 12000,
                                      };
                                      _inspectionAnswers = {};
                                      _inspectedValuation = double.parse(_selectedOrderForInspection['rawBase'].toString());
                                      _currentIndex = 2; // Jump to inspect tab
                                    });
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF39B54A),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: const Text('Inspect Device'),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  // ==========================================
  // TAB 3: STEP-BY-STEP DEVICE INSPECTION
  // ==========================================
  Widget _buildInspectionTab() {
    if (_selectedOrderForInspection == null) {
      if (_isValuationSimulatorMode) {
        return _buildValuationSimulatorView();
      }

      return Scaffold(
        appBar: AppBar(
          title: const Text('On-Site Diagnostics', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.fact_check_outlined, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text(
                'No device selected for inspection',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _currentIndex = 1; // Go to pickups tab to select one
                  });
                },
                icon: const Icon(Icons.playlist_add_check),
                label: const Text('Select a Pickup'),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF39B54A), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () {
                  setState(() {
                    _isValuationSimulatorMode = true;
                    _simCategory = null;
                    _simBrand = null;
                    _simModel = null;
                    _simAnswers = {};
                  });
                },
                icon: const Icon(Icons.calculate_outlined),
                label: const Text('Quick Valuation Simulator'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF39B54A),
                  side: const BorderSide(color: Color(0xFF39B54A)),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final double baseValuation = double.parse(_selectedOrderForInspection['rawBase']?.toString() ?? '15000');

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Inspect: ${_selectedOrderForInspection['device'] ?? _selectedOrderForInspection['model'] ?? 'Device'}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            setState(() {
              _selectedOrderForInspection = null;
            });
          },
        ),
      ),
      body: Column(
        children: [
          // Live Pricing Top Bar Tracker
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: const Color(0xFF0C213A),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Live Valuation:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text(
                  '₹${_inspectedValuation.toStringAsFixed(0)}',
                  style: const TextStyle(color: Color(0xFF39B54A), fontWeight: FontWeight.w900, fontSize: 18),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _questions.length,
              itemBuilder: (context, qIdx) {
                final question = _questions[qIdx];
                final qId = int.parse(question['id'].toString());
                final selectedAns = _inspectionAnswers[qId];

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.grey.shade200),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${qIdx + 1}. ${question['text']}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ChoiceChip(
                                label: const Center(child: Text('Yes / Perfect')),
                                selected: selectedAns == 'Yes',
                                onSelected: (sel) {
                                  setState(() {
                                    _inspectionAnswers[qId] = 'Yes';
                                    _recalculateValuation(baseValuation);
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: ChoiceChip(
                                label: const Center(child: Text('No / Defect')),
                                selected: selectedAns == 'No',
                                onSelected: (sel) {
                                  setState(() {
                                    _inspectionAnswers[qId] = 'No';
                                    _recalculateValuation(baseValuation);
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Action Row Footer
          Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  _submitInspectionReport();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF39B54A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Submit Valuation & Payout', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _recalculateValuation(double baseVal) {
    double currentVal = baseVal;
    _inspectionAnswers.forEach((qId, answer) {
      if (answer == 'No') {
        // Apply deduction rules (15% per defect for mock simplicity)
        currentVal -= baseVal * 0.15;
      }
    });
    if (currentVal < baseVal * 0.2) {
      currentVal = baseVal * 0.2; // Floor value at 20%
    }
    setState(() {
      _inspectedValuation = currentVal;
    });
  }

  Future<void> _submitInspectionReport() async {
    if (_selectedOrderForInspection == null) return;
    final orderId = _selectedOrderForInspection['id'];

    // Post inspection update to backend db
    try {
      // Fetch current order from api
      final target = _orders.firstWhere((o) => o['id'] == orderId, orElse: () => null);
      if (target != null) {
        final updated = Map<String, dynamic>.from(target);
        updated['price'] = '₹${_inspectedValuation.toStringAsFixed(0)}';
        updated['status'] = 'Inspection Complete';

        await _dio.post(
          '$apiBaseUrl/orders',
          data: {
            'action': 'update',
            'item': updated,
          },
        );

        // Update pickup status to Completed
        await _updatePickupStatus(orderId, 'Completed');

        // Add commission payout to local balance
        setState(() {
          _walletBalance += (_inspectedValuation * 0.05); // 5% partner commission
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Inspection completed! Commission ₹${(_inspectedValuation * 0.05).toStringAsFixed(0)} credited to wallet!'),
            backgroundColor: const Color(0xFF39B54A),
          ),
        );

        setState(() {
          _selectedOrderForInspection = null;
          _currentIndex = 0; // Return to dashboard
        });
      }
    } catch (e) {
      debugPrint('Error submitting inspection: $e');
    }
  }

  // ==========================================
  // TAB 4: WALLET & INSTANT PAYOUTS REQUEST
  // ==========================================
  Widget _buildWalletTab() {
    final TextEditingController upiController = TextEditingController();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Earnings & Wallet', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Balance Panel
            Container(
              padding: const EdgeInsets.all(24),
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF39B54A), Color(0xFF2FA03E)]),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.green.shade200, blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AVAILABLE BALANCE', style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  const SizedBox(height: 8),
                  Text(
                    '₹${_walletBalance.toStringAsFixed(0)}',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 32),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Payout Request Section
            Card(
              color: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Request Instant Payout', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 4),
                    const Text('Transfer your balance immediately to your linked UPI address.', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    const SizedBox(height: 16),
                    TextField(
                      controller: upiController,
                      decoration: InputDecoration(
                        hintText: 'e.g. mobilehub@okaxis',
                        labelText: 'Enter UPI Address',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        prefixIcon: const Icon(Icons.send_to_mobile),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          if (upiController.text.isEmpty || !upiController.text.contains('@')) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please enter a valid UPI address'), backgroundColor: Colors.red),
                            );
                            return;
                          }
                          _playChime();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Payout request of ₹${_walletBalance.toStringAsFixed(0)} submitted successfully!'),
                              backgroundColor: const Color(0xFF39B54A),
                            ),
                          );
                          setState(() {
                            _walletBalance = 0; // Clear balance
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF39B54A),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Transfer Instantly'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 5: PARTNER SETTINGS
  // ==========================================
  Widget _buildSettingsTab() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings & Profile', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Account Summary info
          Card(
            color: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.grey.shade200),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Partner Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const Divider(height: 24),
                  _buildProfileRow('Partner ID', _partnerId),
                  _buildProfileRow('Store Name', 'MobileHub Store'),
                  _buildProfileRow('Commission Rate', 'Up to 10%'),
                  _buildProfileRow('Assigned Zone', _partnerZone),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Status & Toggles List
          ListTile(
            title: const Text('Status Indicator', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(_partnerStatus == 'Online' ? 'Receiving active doorstep leads' : 'Offline'),
            trailing: Switch(
              value: _partnerStatus == 'Online',
              onChanged: (val) {
                _playChime();
                setState(() {
                  _partnerStatus = val ? 'Online' : 'Offline';
                });
              },
            ),
          ),
          const Divider(),
          const ListTile(
            title: Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Receive sound alerts for assigned doorstep pickups'),
            trailing: Icon(Icons.notifications_active, color: Color(0xFF39B54A)),
          ),
          const Divider(),
          const ListTile(
            title: Text('App Version', style: TextStyle(fontWeight: FontWeight.bold)),
            trailing: Text('v1.0.0 (Premium)'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }

  double _calculateSimValuation(List<dynamic> matchingQs) {
    if (_simModel == null) return 0.0;
    final base = double.parse(_simModel['rawBase']?.toString() ?? '15000');
    double running = base;
    _simAnswers.forEach((qId, ansText) {
      final q = matchingQs.firstWhere((question) => int.parse(question['id'].toString()) == qId, orElse: () => null);
      if (q != null) {
        final List<dynamic> options = q['options'] ?? [];
        final opt = options.firstWhere((o) => o['optionText']?.toString().toLowerCase() == ansText.toLowerCase(), orElse: () => null);
        if (opt != null) {
          final type = opt['deductionType']?.toString().toLowerCase();
          final val = (opt['deductionValue'] as num?)?.toInt() ?? 0;
          if (type == 'flat') {
            running -= val;
          } else if (type == 'percentage') {
            running -= ((running * val) / 100).round();
          }
        }
      }
    });
    final minVal = double.parse(_simModel['rawMin']?.toString() ?? '3000');
    return running < minVal ? minVal : running;
  }

  Widget _buildValuationSimulatorView() {
    if (_simCategory == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Simulator: Select Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => setState(() => _isValuationSimulatorMode = false),
          ),
        ),
        body: GridView.count(
          crossAxisCount: 2,
          padding: const EdgeInsets.all(16),
          children: _categories.map((cat) {
            return Card(
              color: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
              child: InkWell(
                onTap: () => setState(() => _simCategory = cat),
                borderRadius: BorderRadius.circular(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.phone_iphone, size: 40, color: Color(0xFF39B54A)),
                    const SizedBox(height: 12),
                    Text(
                      cat['name'] ?? '',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0C213A)),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      );
    }

    if (_simBrand == null) {
      final catName = _simCategory['name'] as String;
      final cleanCat = catName.replaceAll('Sell ', '').toLowerCase();
      final matchingBrands = _brands.where((b) {
        final List<dynamic> cats = b['categories'] ?? [];
        if (cats.isEmpty) return true;
        return cats.any((c) => c.toString().toLowerCase().contains(cleanCat) || cleanCat.contains(c.toString().toLowerCase()));
      }).toList();

      return Scaffold(
        appBar: AppBar(
          title: const Text('Simulator: Select Brand', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => setState(() => _simCategory = null),
          ),
        ),
        body: ListView.builder(
          itemCount: matchingBrands.length,
          itemBuilder: (context, idx) {
            final brand = matchingBrands[idx];
            return ListTile(
              title: Text(brand['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0C213A))),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => setState(() => _simBrand = brand),
            );
          },
        ),
      );
    }

    if (_simModel == null) {
      final brandName = _simBrand['name'] as String;
      final catName = _simCategory['name'] as String;
      final cleanCat = catName.replaceAll('Sell ', '').toLowerCase();
      final matchingModels = _models.where((m) {
        final mBrand = m['brand']?.toString().toLowerCase() ?? '';
        final mCat = m['category']?.toString().toLowerCase() ?? '';
        return mBrand == brandName.toLowerCase() &&
            (mCat.contains(cleanCat) || cleanCat.contains(mCat));
      }).toList();

      return Scaffold(
        appBar: AppBar(
          title: const Text('Simulator: Select Model', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => setState(() => _simBrand = null),
          ),
        ),
        body: ListView.builder(
          itemCount: matchingModels.length,
          itemBuilder: (context, idx) {
            final model = matchingModels[idx];
            return ListTile(
              title: Text(model['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0C213A))),
              subtitle: Text(model['brand'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 11)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => setState(() => _simModel = model),
            );
          },
        ),
      );
    }

    // Diagnostics questions view for simulator mode
    final catName = _simModel['category']?.toString().toLowerCase() ?? '';
    final brandName = _simModel['brand']?.toString().toLowerCase() ?? '';
    final modelName = _simModel['name']?.toString().toLowerCase() ?? '';
    final matchingQuestions = _questions.where((q) {
      final List<dynamic> qCats = q['categories'] ?? [];
      final List<dynamic> qBrands = q['brands'] ?? [];
      final List<dynamic> qModels = q['models'] ?? [];

      final matchesCat = qCats.isEmpty || qCats.any((c) => catName.contains(c.toString().toLowerCase()) || c.toString().toLowerCase().contains(catName));
      final matchesBrand = qBrands.isEmpty || qBrands.any((b) => brandName.contains(b.toString().toLowerCase()) || b.toString().toLowerCase().contains(brandName));
      final matchesModel = qModels.isEmpty || qModels.any((m) => modelName.contains(m.toString().toLowerCase()) || m.toString().toLowerCase().contains(modelName));

      return matchesCat && matchesBrand && matchesModel;
    }).toList();

    // Default values
    for (final q in matchingQuestions) {
      final qId = int.parse(q['id'].toString());
      if (!_simAnswers.containsKey(qId)) {
        final List<dynamic> options = q['options'] ?? [];
        if (options.isNotEmpty) {
          _simAnswers[qId] = options[0]['optionText'] ?? '';
        }
      }
    }

    final curValuation = _calculateSimValuation(matchingQuestions);

    return Scaffold(
      appBar: AppBar(
        title: Text('Simulation: ${_simModel['name']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => setState(() => _simModel = null),
        ),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: const Color(0xFF0C213A),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Est. Value:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text(
                  '₹${curValuation.toStringAsFixed(0)}',
                  style: const TextStyle(color: Color(0xFF39B54A), fontWeight: FontWeight.w900, fontSize: 18),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: matchingQuestions.length,
              itemBuilder: (context, qIdx) {
                final question = matchingQuestions[qIdx];
                final qId = int.parse(question['id'].toString());
                final selectedAns = _simAnswers[qId];
                final List<dynamic> options = question['options'] ?? [];

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.grey.shade200),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(question['text'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0C213A))),
                        const SizedBox(height: 12),
                        Row(
                          children: options.map((opt) {
                            final text = opt['optionText'] ?? '';
                            final active = selectedAns?.toLowerCase() == text.toString().toLowerCase();

                            return Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: OutlinedButton(
                                  onPressed: () {
                                    setState(() {
                                      _simAnswers[qId] = text;
                                    });
                                  },
                                  style: OutlinedButton.styleFrom(
                                    backgroundColor: active ? const Color(0xFF39B54A).withValues(alpha: 0.12) : Colors.white,
                                    side: BorderSide(color: active ? const Color(0xFF39B54A) : Colors.grey.shade300),
                                    padding: const EdgeInsets.symmetric(vertical: 10),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: Text(
                                    text,
                                    style: TextStyle(
                                      color: active ? const Color(0xFF39B54A) : Colors.black87,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    _isValuationSimulatorMode = false;
                  });
                },
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0C213A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                child: const Text('Exit Simulator Mode', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Sparkline graph Custom Painter logic
class _SparklinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF39B54A)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = const Color(0xFF39B54A).withValues(alpha: 0.12)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height * 0.7)
      ..quadraticBezierTo(size.width * 0.25, size.height * 0.5, size.width * 0.5, size.height * 0.3)
      ..quadraticBezierTo(size.width * 0.75, size.height * 0.1, size.width, size.height * 0.2);

    final fillPath = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, paint);

    // Draw active dot
    final dotPaint = Paint()..color = const Color(0xFF0C213A);
    canvas.drawCircle(Offset(size.width * 0.5, size.height * 0.3), 6, dotPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class PartnerOnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;
  const PartnerOnboardingScreen({super.key, required this.onComplete});

  @override
  State<PartnerOnboardingScreen> createState() => _PartnerOnboardingScreenState();
}

class _PartnerOnboardingScreenState extends State<PartnerOnboardingScreen> {
  final PageController _controller = PageController();
  int _slideIndex = 0;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Doorstep Pickups',
      'desc': 'Claim and handle client device collection pickups in your designated service zone.',
      'icon': '📍',
      'image': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300'
    },
    {
      'title': 'On-Site Diagnostic Checks',
      'desc': 'Run diagnostic checklists with customers to finalize final accurate valuations on-site.',
      'icon': '📋',
      'image': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300'
    },
    {
      'title': 'Instant Wallet Payouts',
      'desc': 'Earn direct commission payouts credited immediately to your digital partner wallet.',
      'icon': '💳',
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
                    'cashifin partner',
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
                          color: _slideIndex == i ? const Color(0xFF39B54A) : Colors.grey.shade300,
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
                      backgroundColor: const Color(0xFF39B54A),
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

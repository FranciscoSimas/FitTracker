import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainLayout extends StatefulWidget {
  final Widget child;
  
  const MainLayout({
    super.key,
    required this.child,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;
  
  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Icons.fitness_center,
      label: 'Treinos',
      route: '/workouts',
    ),
    NavigationItem(
      icon: Icons.list_alt,
      label: 'Exercícios',
      route: '/exercises',
    ),
    NavigationItem(
      icon: Icons.trending_up,
      label: 'Evolução',
      route: '/evolution',
    ),
    NavigationItem(
      icon: Icons.person,
      label: 'Perfil',
      route: '/profile',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
          context.go(_navigationItems[index].route);
        },
        type: BottomNavigationBarType.fixed,
        items: _navigationItems.map((item) => BottomNavigationBarItem(
          icon: Icon(item.icon),
          label: item.label,
        )).toList(),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final String label;
  final String route;
  
  NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
  });
}


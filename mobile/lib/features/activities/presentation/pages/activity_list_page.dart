import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/widgets/loading_widget.dart';
import '../../../../core/widgets/error_widget.dart';
import '../../../../core/widgets/empty_state_widget.dart';
import '../../../../core/widgets/activity_card.dart';
import '../../../../core/widgets/fab_button.dart';
import '../providers/activity_provider.dart';
import 'activity_detail_page.dart';
import 'create_activity_page.dart';

class ActivityListPage extends ConsumerStatefulWidget {
  const ActivityListPage({super.key});

  @override
  ConsumerState<ActivityListPage> createState() => _ActivityListPageState();
}

class _ActivityListPageState extends ConsumerState<ActivityListPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(activityListProvider.notifier).loadActivities();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.8) {
      ref.read(activityListProvider.notifier).loadMoreActivities();
    }
  }

  @override
  Widget build(BuildContext context) {
    final activityListState = ref.watch(activityListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Activities'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // TODO: Implement filter
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.read(activityListProvider.notifier).refreshActivities();
        },
        child: activityListState.when(
          data: (activities) {
            if (activities.isEmpty) {
              return EmptyStateWidget(
                icon: Icons.assignment_outlined,
                title: 'No Activities Yet',
                subtitle: 'Start tracking your achievements by adding your first activity.',
                actionText: 'Add Activity',
                onActionPressed: () {
                  context.push('/activities/create');
                },
              );
            }

            return ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: activities.length + 1, // +1 for loading indicator
              itemBuilder: (context, index) {
                if (index == activities.length) {
                  return activityListState.isLoadingMore
                      ? const Padding(
                          padding: EdgeInsets.all(16),
                          child: Center(child: CircularProgressIndicator()),
                        )
                      : const SizedBox.shrink();
                }

                final activity = activities[index];
                return ActivityCard(
                  activity: activity,
                  onTap: () {
                    context.push('/activities/${activity.id}');
                  },
                  onEdit: () {
                    context.push('/activities/${activity.id}/edit');
                  },
                  onDelete: () {
                    _showDeleteDialog(context, activity.id);
                  },
                );
              },
            );
          },
          loading: () => const LoadingWidget(),
          error: (error, stackTrace) => ErrorWidget(
            message: error.toString(),
            onRetry: () {
              ref.read(activityListProvider.notifier).loadActivities();
            },
          ),
        ),
      ),
      floatingActionButton: FabButton(
        icon: Icons.add,
        onPressed: () {
          context.push('/activities/create');
        },
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, String activityId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Activity'),
        content: const Text('Are you sure you want to delete this activity? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(activityListProvider.notifier).deleteActivity(activityId);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}

import EventItem from '@/components/EventItem/EventItem';
import EventPagination from '@/components/Pagination/Pagination';
import {
  fadeInVariants,
  fadeUpVariants,
  motionTransition,
  staggerContainerVariants,
} from '@/constants/motion';
import { motion } from 'motion/react';

import EventFilterBar from './components/EventFilterBar/EventFilterBar';
import EventFilters from './components/EventFilters/EventFilters';

const asideLeftVariants = {
  hidden: {
    opacity: 0,
    x: -18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

const contentRightVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      x: motionTransition.smooth,
      opacity: motionTransition.opacity,
    },
  },
};

function EventExplorer({
  events = [],
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  onApply,
  totalEvents,
  sort,
  onSortChange,
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-12 gap-4"
    >
      <motion.aside
        variants={asideLeftVariants}
        className="col-span-12 lg:col-span-3"
      >
        <EventFilters onApply={onApply} />
      </motion.aside>

      <motion.section
        variants={contentRightVariants}
        className="
          col-span-12 rounded-[28px] border border-[var(--border-color)]
          bg-[var(--card-surface-color)]
          p-4 shadow-[0_20px_70px_rgba(0,0,0,0.24)]
          backdrop-blur-xl lg:col-span-9
        "
      >
        <EventFilterBar
          value={sort}
          onChange={onSortChange}
          totalEvents={totalEvents}
        />

        <motion.div
          variants={staggerContainerVariants}
          className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={fadeUpVariants}>
                <EventItemSkeleton />
              </motion.div>
            ))
          ) : events.length > 0 ? (
            events.map((event, index) => {
              const delay = Math.min(index * 0.08, 0.36);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    y: {
                      ...motionTransition.smooth,
                      delay,
                    },
                    opacity: {
                      ...motionTransition.opacity,
                      delay,
                    },
                  }}
                >
                  <EventItem event={event} />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={fadeInVariants}
              className="
                col-span-full flex min-h-[260px] items-center justify-center
                rounded-[24px] border border-dashed border-[var(--border-color)]
                bg-[var(--soft-surface-color)]
              "
            >
              <p className="text-center text-sm font-medium text-[var(--muted-text)]">
                Không tìm thấy sự kiện phù hợp.
              </p>
            </motion.div>
          )}
        </motion.div>

        {totalPages > 1 && (
          <motion.div variants={fadeUpVariants} className="mt-8">
            <EventPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
}

function EventItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-color)]">
      <div className="h-50 animate-pulse bg-[var(--background-color)]" />

      <div className="space-y-4 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-[var(--background-color)]" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[var(--background-color)]" />

        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <div className="h-8 w-24 animate-pulse rounded-full bg-[var(--background-color)]" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-[var(--background-color)]" />
        </div>
      </div>
    </div>
  );
}

export default EventExplorer;

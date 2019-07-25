import { BehaviorSubject } from 'rxjs';

export class NgxLinkPreviewLoadingManager {
   /** The loading stack, holding an item for each */
   private loadingStack: string[] = [];

   /** Observable to retrieve if has pending jobs */
   public hasPendingJobs$ = new BehaviorSubject(false);

   constructor() {}

   /**
    * Add task to stack
    */
   public addTask(name?: string): void {
      name = this.getTaskName(name);
      this.loadingStack.push(name);
      this.emitHasPendingJobs();
   }

   /**
    * Remove task from stack
    */
   public removeTask(name?: string): void {
      name = this.getTaskName(name);
      if (this.loadingStack.length) {
         const taskIndex = this.loadingStack.indexOf(name);
         if (taskIndex !== -1) {
            this.loadingStack.splice(taskIndex, 1);
         } else {
            console.error(`[NgxLinkPreviewLoadingManager] Task [${name}] not found and can't be removed.`);
         }
      } else {
         console.error('[NgxLinkPreviewLoadingManager] No pending task available for remove');
      }
      this.emitHasPendingJobs();
   }

   /**
    * Get task name
    */
   private getTaskName(name: string): string {
      return name ? name : 'UNKNOWN_TASK';
   }

   /**
    * Emit if has loading jobs
    */
   private emitHasPendingJobs(): void {
      if (this.loadingStack.length) {
         this.hasPendingJobs$.next(true);
      } else {
         this.hasPendingJobs$.next(false);
      }
   }
}

// Type definitions for RxJS
// Project: http://rx.codeplex.com/
// Definitions by: gsino <http://www.codeplex.com/site/users/view/gsino>
// Definitions by: Igor Oleinikov <https://github.com/Igorbek>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module Rx {
	export module Internals {
		function isEqual(left: any, right: any): boolean;
		function inherits(child: Function, parent: Function): Function;
		function addProperties(obj: Object, ...sourcces: Object[]): void;
		function addRef<T>(xs: Observable<T>, r: { getDisposable(): IDisposable; }): Observable<T>;

		// Priority Queue for Scheduling
		export class PriorityQueue<TTime> {
			constructor(capacity: number);

			length: number;

			isHigherPriority(left: number, right: number): boolean;
			percolate(index: number): void;
			heapify(index: number): void;
			peek(): ScheduledItem<TTime>;
			removeAt(index: number): void;
			dequeue(): ScheduledItem<TTime>;
			enqueue(item: ScheduledItem<TTime>): void;
			remove(item: ScheduledItem<TTime>): boolean;

			static count: number;
		}

		export class ScheduledItem<TTime> {
			constructor(scheduler: IScheduler, state: any, action: (scheduler: IScheduler, state: any) => IDisposable, dueTime: TTime, comparer?: (x: TTime, y: TTime) => number);

			scheduler: IScheduler;
			state: TTime;
			action: (scheduler: IScheduler, state: any) => IDisposable;
			dueTime: TTime;
			comparer: (x: TTime, y: TTime) => number;
			disposable: SingleAssignmentDisposable;

			invoke(): void;
			compareTo(other: ScheduledItem<TTime>): number;
			isCancelled(): boolean;
			invokeCore(): IDisposable;
		}
	}

	export interface IDisposable {
		dispose(): void;
	}

	export class CompositeDisposable implements IDisposable {
		constructor (...disposables: IDisposable[]);
		constructor (disposables: IDisposable[]);

		isDisposed: boolean;
		length: number;

		dispose(): void;
		add(item: IDisposable): void;
		remove(item: IDisposable): boolean;
		clear(): void;
		contains(item: IDisposable): boolean;
		toArray(): IDisposable[];
	}

	export class Disposable implements IDisposable {
		constructor(action: () => void);

		static create(action: () => void): IDisposable;
		static empty: IDisposable;

		dispose(): void;
	}

	// Single assignment
	export class SingleAssignmentDisposable implements IDisposable {
		constructor();

		isDisposed: boolean;
		current: IDisposable;

		dispose(): void ;
		getDisposable(): IDisposable;
		setDisposable(value: IDisposable): void ;
	}

	// Multiple assignment disposable
	export class SerialDisposable implements IDisposable {
		constructor();

		isDisposed: boolean;

		dispose(): void;
		getDisposable(): IDisposable;
		setDisposable(value: IDisposable): void;
	}

	export class RefCountDisposable implements IDisposable {
		constructor(disposable: IDisposable);

		dispose(): void;

		isDisposed: boolean;
		getDisposable(): IDisposable;
	}

	export interface IScheduler {
		now(): number;
		catch(handler: (exception: any) => boolean): IScheduler;
		catchException(handler: (exception: any) => boolean): IScheduler;

		schedule(action: () => void): IDisposable;
		scheduleWithState<TState>(state: TState, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;
		scheduleWithAbsolute(dueTime: number, action: () => void): IDisposable;
		scheduleWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (scheduler: IScheduler, state: TState) =>IDisposable): IDisposable;
		scheduleWithRelative(dueTime: number, action: () => void): IDisposable;
		scheduleWithRelativeAndState<TState>(state: TState, dueTime: number, action: (scheduler: IScheduler, state: TState) =>IDisposable): IDisposable;

		scheduleRecursive(action: (action: () =>void ) =>void ): IDisposable;
		scheduleRecursiveWithState<TState>(state: TState, action: (state: TState, action: (state: TState) =>void ) =>void ): IDisposable;
		scheduleRecursiveWithAbsolute(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;
		scheduleRecursiveWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;
		scheduleRecursiveWithRelative(dueTime: number, action: (action: (dueTime: number) =>void ) =>void ): IDisposable;
		scheduleRecursiveWithRelativeAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) =>void ) =>void ): IDisposable;

		schedulePeriodic(period: number, action: () => void): IDisposable;
		schedulePeriodicWithState<TState>(state: TState, period: number, action: (state: TState) => TState): IDisposable;
	}

	export class Scheduler implements IScheduler {
		constructor(
			now: () => number,
			schedule: (state: any, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable,
			scheduleRelative: (state: any, dueTime: number, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable,
			scheduleAbsolute: (state: any, dueTime: number, action: (scheduler: IScheduler, state: any) => IDisposable) => IDisposable);

		static normalize(timeSpan: number): number;

		static immediate: IScheduler;
		static currentThread: ICurrentThreadScheduler;
		static timeout: IScheduler;

		now(): number;
		catch(handler: (exception: any) => boolean): IScheduler;
		catchException(handler: (exception: any) => boolean): IScheduler;

		schedule(action: () => void): IDisposable;
		scheduleWithState<TState>(state: TState, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;
		scheduleWithAbsolute(dueTime: number, action: () => void): IDisposable;
		scheduleWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;
		scheduleWithRelative(dueTime: number, action: () => void): IDisposable;
		scheduleWithRelativeAndState<TState>(state: TState, dueTime: number, action: (scheduler: IScheduler, state: TState) => IDisposable): IDisposable;

		scheduleRecursive(action: (action: () => void) => void): IDisposable;
		scheduleRecursiveWithState<TState>(state: TState, action: (state: TState, action: (state: TState) => void) => void): IDisposable;
		scheduleRecursiveWithAbsolute(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;
		scheduleRecursiveWithAbsoluteAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;
		scheduleRecursiveWithRelative(dueTime: number, action: (action: (dueTime: number) => void) => void): IDisposable;
		scheduleRecursiveWithRelativeAndState<TState>(state: TState, dueTime: number, action: (state: TState, action: (state: TState, dueTime: number) => void) => void): IDisposable;

		schedulePeriodic(period: number, action: () => void): IDisposable;
		schedulePeriodicWithState<TState>(state: TState, period: number, action: (state: TState) => TState): IDisposable;
	}

	// Current Thread IScheduler
	interface ICurrentThreadScheduler extends IScheduler {
		scheduleRequired(): boolean;
		ensureTrampoline(action: () =>IDisposable): IDisposable;
	}

	// Notifications
	export class Notification<T> {
		accept(observer: Observer<T>): void;
		accept<TResult>(onNext: (value: T) => TResult, onError?: (exception: any) => TResult, onCompleted?: () => TResult): TResult;
		toObservable(scheduler?: IScheduler): Observable<T>;
		hasValue: boolean;
		equals(other: Notification<T>): boolean;
		kind: string;
		value: T;
		exception: any;

		static createOnNext<T>(value: T): Notification<T>;
		static createOnError<T>(exception: any): Notification<T>;
		static createOnCompleted<T>(): Notification<T>;
	}

	// Observer
	export class Observer<T> {
		onNext(value: T): void;
		onError(exception: any): void;
		onCompleted(): void;

		toNotifier(): (notification: Notification<T>) =>void;
		asObserver(): Observer<T>;
		checked(): Observer<any>;

		static create<T>(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): Observer<T>;
		static fromNotifier<T>(handler: (notification: Notification<T>) => void): Observer<T>;
	}

	export interface Observable<T> {
		subscribe(observer: Observer<T>): IDisposable;
		subscribe(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): IDisposable;

		toArray(): Observable<T[]>;

		observeOn(scheduler: IScheduler): Observable<T>;
		subscribeOn(scheduler: IScheduler): Observable<T>;

		amb(rightSource: Observable<T>): Observable<T>;
		catch(handler: (exception: any) => Observable<T>): Observable<T>;
		catchException(handler: (exception: any) => Observable<T>): Observable<T>;	// alias for catch
		catch(second: Observable<T>): Observable<T>;
		catchException(second: Observable<T>): Observable<T>;	// alias for catch
		combineLatest<T2, TResult>(second: Observable<T2>, resultSelector: (v1: T, v2: T2) => TResult): Observable<TResult>;
		combineLatest<T2, T3, TResult>(second: Observable<T2>, third: Observable<T3>, resultSelector: (v1: T, v2: T2, v3: T3) => TResult): Observable<TResult>;
		combineLatest<T2, T3, T4, TResult>(second: Observable<T2>, third: Observable<T3>, fourth: Observable<T4>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4) => TResult): Observable<TResult>;
		combineLatest<T2, T3, T4, T5, TResult>(second: Observable<T2>, third: Observable<T3>, fourth: Observable<T4>, fifth: Observable<T5>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => TResult): Observable<TResult>;
		combineLatest<TOther, TResult>(souces: Observable<TOther>[], resultSelector: (firstValue: T, ...otherValues: TOther[]) => TResult): Observable<TResult>;
		concat(...sources: Observable<T>[]): Observable<T>;
		concat(sources: Observable<T>[]): Observable<T>;
		concatAll(): T;
		concatObservable(): T;	// alias for concatAll
		merge(maxConcurrent: number): Observable<T>;
		merge(other: Observable<T>): Observable<T>;
		mergeAll(): T;
		mergeObservable(): T;	// alias for mergeAll
		onErrorResumeNext(second: Observable<T>): Observable<T>;
		skipUntil<T2>(other: Observable<T2>): Observable<T>;
		switchLatest(): T;
		takeUntil<T2>(other: Observable<T2>): Observable<T>;
		zip<T2, TResult>(second: Observable<T2>, resultSelector: (v1: T, v2: T2) => TResult): Observable<TResult>;
		zip<T2, T3, TResult>(second: Observable<T2>, third: Observable<T3>, resultSelector: (v1: T, v2: T2, v3: T3) => TResult): Observable<TResult>;
		zip<T2, T3, T4, TResult>(second: Observable<T2>, third: Observable<T3>, fourth: Observable<T4>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4) => TResult): Observable<TResult>;
		zip<T2, T3, T4, T5, TResult>(second: Observable<T2>, third: Observable<T3>, fourth: Observable<T4>, fifth: Observable<T5>, resultSelector: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => TResult): Observable<TResult>;
		zip<TOther, TResult>(second: Observable<TOther>[], resultSelector: (left: T, right: Observable<TOther>) => TResult): Observable<TResult>;
		asObservable(): Observable<T>;
		bufferWithCount(count: number, skip?: number): Observable<T[]>;
		dematerialize<TOrigin>(): Observable<TOrigin>;
		distinctUntilChanged(skipParameter: boolean, comparer: (x: T, y: T) => boolean): Observable<T>;
		distinctUntilChanged<TValue>(keySelector?: (value: T) => TValue, comparer?: (x: TValue, y: TValue) => boolean): Observable<T>;
		do(observer: Observer<T>): Observable<T>;
		doAction(observer: Observer<T>): Observable<T>;	// alias for do
		do(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): Observable<T>;
		doAction(onNext?: (value: T) => void, onError?: (exception: any) => void, onCompleted?: () => void): Observable<T>;	// alias for do
		finally(action: () => void): Observable<T>;
		finallyAction(action: () => void): Observable<T>;	// alias for finally
		ignoreElements(): Observable<T>;
		materialize(): Observable<Notification<T>>;
		repeat(repeatCount?: number): Observable<T>;
		retry(retryCount?: number): Observable<T>;
		scan<TAcc>(seed: TAcc, accumulator: (acc: TAcc, value: T) => TAcc): Observable<TAcc>;
		scan(accumulator: (acc: T, value: T) => T): Observable<T>;
		skipLast(count: number): Observable<T>;
		startWith(...values: T[]): Observable<T>;
		startWith(scheduler: IScheduler, ...values: T[]): Observable<T>;
		takeLast(count: number, scheduler?: IScheduler): Observable<T>;
		takeLastBuffer(count: number): Observable<T[]>;
		windowWithCount(count: number, skip?: number): Observable<Observable<T>>;
		defaultIfEmpty(defaultValue?: T): Observable<T>;
		distinct(skipParameter: boolean, valueSerializer: (value: T) => string): Observable<T>;
		distinct<TKey>(keySelector?: (value: T) => TKey, keySerializer?: (key: TKey) => string): Observable<T>;
		groupBy<TKey, TElement>(keySelector: (value: T) => TKey, skipElementSelector?: boolean, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, T>>;
		groupBy<TKey, TElement>(keySelector: (value: T) => TKey, elementSelector: (value: T) => TElement, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, T>>;
		groupByUntil<TKey, TDuration>(keySelector: (value: T) => TKey, skipElementSelector: boolean, durationSelector: (group: GroupedObservable<TKey, T>) => Observable<TDuration>, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, T>>;
		groupByUntil<TKey, TElement, TDuration>(keySelector: (value: T) => TKey, elementSelector: (value: T) => TElement, durationSelector: (group: GroupedObservable<TKey, TElement>) => Observable<TDuration>, keySerializer?: (key: TKey) => string): Observable<GroupedObservable<TKey, TElement>>;
		select<TResult>(selector: (value: T, index: number, source: Observable<T>) => TResult, thisArg?: any): Observable<TResult>;
		map<TResult>(selector: (value: T, index: number, source: Observable<T>) => TResult, thisArg?: any): Observable<TResult>;	// alias for select
		selectMany<TOther, TResult>(selector: (value: T) => Observable<TOther>, resultSelector: (item: T, other: TOther) => TResult): Observable<TResult>;
		selectMany<TResult>(selector: (value: T) => Observable<TResult>): Observable<TResult>;
		selectMany<TResult>(other: Observable<TResult>): Observable<TResult>;
		flatMap<TOther, TResult>(selector: (value: T) => Observable<TOther>, resultSelector: (item: T, other: TOther) => TResult): Observable<TResult>;	// alias for selectMany
		flatMap<TResult>(selector: (value: T) => Observable<TResult>): Observable<TResult>;	// alias for selectMany
		flatMap<TResult>(other: Observable<TResult>): Observable<TResult>;	// alias for selectMany
		skip(count: number): Observable<T>;
		skipWhile(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<T>;
		take(count: number, scheduler?: IScheduler): Observable<T>;
		takeWhile(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<T>;
		where(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<T>;
		filter(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<T>; // alias for where
	}

	interface ObservableStatic {
		create<T>(subscribe: (observer: Observer<T>) => void): Observable<T>;
		create<T>(subscribe: (observer: Observer<T>) => () => void): Observable<T>;
		createWithDisposable<T>(subscribe: (observer: Observer<T>) => IDisposable): Observable<T>;
		defer<T>(observableFactory: () => Observable<T>): Observable<T>;
		empty<T>(scheduler?: IScheduler): Observable<T>;
		fromArray<T>(array: T[], scheduler?: IScheduler): Observable<T>;
		fromArray<T>(array: { length: number;[index: number]: T; }, scheduler?: IScheduler): Observable<T>;
		generate<TState, TResult>(initialState: TState, condition: (state: TState) => boolean, iterate: (state: TState) => TState, resultSelector: (state: TState) => TResult, scheduler?: IScheduler): Observable<TResult>;
		never<T>(): Observable<T>;
		range(start: number, count: number, scheduler?: IScheduler): Observable<number>;
		repeat<T>(value: T, repeatCount?: number, scheduler?: IScheduler): Observable<T>;
		return<T>(value: T, scheduler?: IScheduler): Observable<T>;
		returnValue<T>(value: T, scheduler?: IScheduler): Observable<T>;	// alias for return
		throw<T>(exception: Error, scheduler?: IScheduler): Observable<T>;
		throw<T>(exception: any, scheduler?: IScheduler): Observable<T>;
		throwException<T>(exception: Error, scheduler?: IScheduler): Observable<T>;	// alias for throw
		throwException<T>(exception: any, scheduler?: IScheduler): Observable<T>;	// alias for throw
		using<TSource, TResource extends IDisposable>(resourceFactory: () => TResource, observableFactory: (resource: TResource) => Observable<TSource>): Observable<TSource>;
		amb<T>(...sources: Observable<T>[]): Observable<T>;
		amb<T>(sources: Observable<T>[]): Observable<T>;
		catch<T>(sources: Observable<T>[]): Observable<T>;
		catchException<T>(sources: Observable<T>[]): Observable<T>;	// alias for catch
		catch<T>(...sources: Observable<T>[]): Observable<T>;
		catchException<T>(...sources: Observable<T>[]): Observable<T>;	// alias for catch
		concat<T>(...sources: Observable<T>[]): Observable<T>;
		concat<T>(sources: Observable<T>[]): Observable<T>;
		merge<T>(...sources: Observable<T>[]): Observable<T>;
		merge<T>(sources: Observable<T>[]): Observable<T>;
		merge<T>(scheduler: IScheduler, ...sources: Observable<T>[]): Observable<T>;
		merge<T>(scheduler: IScheduler, sources: Observable<T>[]): Observable<T>;
		onErrorResumeNext<T>(...sources: Observable<T>[]): Observable<T>;
		onErrorResumeNext<T>(sources: Observable<T>[]): Observable<T>;
		zip<T1, T2, TResult>(first: Observable<T1>, sources: Observable<T2>[], resultSelector: (item1: T1, right: Observable<T2>) => TResult): Observable<TResult>;
		zip<T1, T2, TResult>(source1: Observable<T1>, source2: Observable<T2>, resultSelector: (item1: T1, item2: T2) => TResult): Observable<TResult>;
		zip<T1, T2, T3, TResult>(source1: Observable<T1>, source2: Observable<T2>, source3: Observable<T3>, resultSelector: (item1: T1, item2: T2, item3: T3) => TResult): Observable<TResult>;
		zip<T1, T2, T3, T4, TResult>(source1: Observable<T1>, source2: Observable<T2>, source3: Observable<T3>, source4: Observable<T4>, resultSelector: (item1: T1, item2: T2, item3: T3, item4: T4) => TResult): Observable<TResult>;
		zip<T1, T2, T3, T4, T5, TResult>(source1: Observable<T1>, source2: Observable<T2>, source3: Observable<T3>, source4: Observable<T4>, source5: Observable<T5>, resultSelector: (item1: T1, item2: T2, item3: T3, item4: T4, item5: T5) => TResult): Observable<TResult>;
		zipArray<T>(...sources: Observable<T>[]): Observable<T[]>;
		zipArray<T>(sources: Observable<T>[]): Observable<T[]>;
	}

	export var Observable: ObservableStatic;

	interface GroupedObservable<TKey, TElement> extends Observable<TElement> {
		key: TKey;
		underlyingObservable: Observable<TElement>;
	}

	interface ISubject<T> extends Observable<T>, Observer<T>, IDisposable {
		hasObservers(): boolean;
	}

    export interface Subject<T> extends ISubject<T> {
    }

    interface SubjectStatic {
        new <T>(): Subject<T>;
		create<T>(observer?: Observer<T>, observable?: Observable<T>): ISubject<T>;
	}

	export var Subject: SubjectStatic;

	export interface AsyncSubject<T> extends Subject<T> {
	}

	interface AsyncSubjectStatic {
		new <T>(): AsyncSubject<T>;
	}

	export var AsyncSubject: AsyncSubjectStatic;
}

declare module "rx" {
    export = Rx
}

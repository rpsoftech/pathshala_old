export declare abstract class GenericQueryBuilder {
    reserved_identifiers: string[];
    private where_array;
    private where_in_array;
    from_array: any[];
    join_array: any[];
    abstract escape_char: [];
    abstract multi_condition_rgx: RegExp;
    abstract condition_rgx: RegExp;
    abstract rand_word: string;
    select_array: any[];
    set_array: any[];
    order_by_array: any[];
    group_by_array: any[];
    having_array: any[];
    limit_to: any[];
    offset_val: any[];
    join_clause: any[];
    last_query_string: any[];
    distinct_clause: any[];
    aliased_tables: any[];
    returning_ids: any[];
    constructor();
    _array_values(item: {}): any[];
    _clear_array(a: any, debug?: boolean): void;
    private _extract_having_parts;
    private _prepare_for_limit_and_offset;
    private _escape_identifiers;
    private _escape_identifiers_string;
    _protect_identifiers(item: any, prefix_single?: boolean, protect_identifiers?: any, field_exists?: boolean): any;
    private _track_aliases;
    private _create_aliases_from_table;
    private _has_operator;
    _build_where_clause(): string;
    _build_from_clause(): string;
    _build_join_string(): string;
    _build_group_by_clause(): string;
    _build_having_clause(): string;
    _build_order_by_clause(): string;
    reset_query(new_last_query: any, debug?: boolean): void;
    where(key: any, value?: any, escape?: boolean): this;
    or_where(key: any, value?: any, escape?: boolean): this;
    private _where;
    where_in(key: any, values: any, escape?: boolean): this;
    or_where_in(key: any, values: any, escape?: boolean): this;
    where_not_in(key: any, values: any, escape?: boolean): this;
    or_where_not_in(key: any, values: any, escape?: boolean): this;
    _where_in(key: string, values: any[], not: any, type?: string, escape?: boolean): this;
    like(field: any, match: any, side?: any): this;
    not_like(field: any, match: any, side: any): this;
    or_like(field: any, match: any, side?: any): this;
    or_not_like(field: any, match: any, side: any): this;
    private _like;
    from(from_param: any): this;
    select(select: any, escape?: boolean): this;
    select_min(select: any, alias: any): this;
    select_max(select: any, alias: any): this;
    select_avg(select: any, alias: any): this;
    select_sum(select: any, alias: any): this;
    private _min_max_avg_sum;
    distinct(do_distinct: any): this;
    group_by(by: any): this;
    having(key: any, value: any, escape?: boolean): this;
    or_having(key: any, value: any, escape?: boolean): this;
    private _having;
    join(table?: string, relation?: string, direction?: string, escape?: boolean): this;
    order_by(orderby: any, direction: any): this;
    limit(limit: any, offset: any): this;
    offset(offset: any): this;
    returning(ids: any): this;
    private set;
    insert(table?: string, set?: any, ignore?: boolean, suffix?: string): any;
    _insert(table?: string, set?: any, ignore?: boolean, suffix?: string): any;
    insert_ignore(table: any, set: any, suffix: any): any;
    _insert_ignore(table: any, set: any, suffix: any): any;
    insert_batch(table: any, set: any, ignore: any, suffix: any): any;
    get(table: any): any;
    _get(table: any): any;
    get_where(table?: any, where?: any): any;
    _get_where(table?: any, where?: any): any;
    count(table: any): any;
    update(table: any, set: any, where?: any): any;
    _update(table?: string, set?: any, where?: any): any;
    update_batch(table?: string, set?: any, index?: any, where?: any): any[];
    delete(table: any, where: any): any;
    _delete(table: any, where: any): any;
    get_compiled_select(table: any): any;
    get_compiled_delete(table: any): any;
    get_compiled_update(table: any): any;
    get_compiled_insert(table: any): any;
    compile_select(table: any): any;
    compile_delete(table: any): any;
    private compile_update;
    private compile_insert;
    private last_query;
    private escape;
    _empty_table(table: any): string;
    _truncate(table: any): string;
    _update_batch(table?: string, set?: any, index?: any, where?: any): any[];
    abstract _qb_escape(str: any): string;
    abstract _insert_batch(table: string, set: [] | string | any, ignore: boolean, suffix: string | ''): any;
    abstract _compile_insert(ignore?: boolean, suffix?: string | ''): any;
    abstract _compile_select(): any;
    abstract _count(table: string): any;
    abstract _compile_update(): any;
    abstract _compile_delete(): any;
}
//# sourceMappingURL=GenericQueryBuilder.d.ts.map
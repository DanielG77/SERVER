package com.tournaments.domain.pagination;

import java.util.Objects;

/**
 * Domain-layer pagination request. Pure POJO — no Spring Data dependencies.
 * Replaces {@code org.springframework.data.domain.Pageable} in the domain port.
 *
 * <p>
 * Page numbers are <strong>0-based</strong> internally. The presentation layer
 * is responsible for converting 1-based UI page numbers before constructing
 * this object.
 */
public final class PageableRequest {

    /** Default field to sort by when none is specified. */
    public static final String DEFAULT_SORT_FIELD = "createdAt";

    /** Default sort direction. */
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    /** Default page size. */
    public static final int DEFAULT_PAGE_SIZE = 10;

    private final int page; // 0-based
    private final int size;
    private final String sortField;
    private final String sortDirection; // "asc" | "desc"

    public PageableRequest(int page, int size, String sortField, String sortDirection) {
        if (page < 0)
            throw new IllegalArgumentException("page must be >= 0, got: " + page);
        if (size <= 0)
            throw new IllegalArgumentException("size must be > 0, got: " + size);
        this.page = page;
        this.size = size;
        this.sortField = Objects.requireNonNull(sortField, "sortField must not be null");
        this.sortDirection = Objects.requireNonNull(sortDirection, "sortDirection must not be null");
    }

    /**
     * Factory with sensible defaults: page 0, size 10, sort by createdAt desc.
     */
    public static PageableRequest ofDefaults() {
        return new PageableRequest(0, DEFAULT_PAGE_SIZE, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION);
    }

    /** 0-based page index. */
    public int getPage() {
        return page;
    }

    /** Maximum number of items per page. */
    public int getSize() {
        return size;
    }

    /**
     * Field name to sort by (using domain/JPA naming, e.g. {@code "createdAt"}).
     */
    public String getSortField() {
        return sortField;
    }

    /** Sort direction: {@code "asc"} or {@code "desc"} (case-insensitive). */
    public String getSortDirection() {
        return sortDirection;
    }
}

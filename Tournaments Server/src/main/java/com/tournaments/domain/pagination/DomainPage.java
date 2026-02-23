package com.tournaments.domain.pagination;

import java.util.List;
import java.util.Objects;

/**
 * Domain-layer pagination result. Pure POJO — no Spring Data dependencies.
 * Replaces {@code org.springframework.data.domain.Page} in the domain port.
 *
 * @param <T> the type of domain objects contained in the page
 */
public final class DomainPage<T> {

    private final List<T> content;
    private final long totalElements;
    private final int totalPages;
    private final int pageNumber; // 0-based (same convention as Spring, adapter handles 1-based UI)
    private final int pageSize;

    public DomainPage(
            List<T> content,
            long totalElements,
            int totalPages,
            int pageNumber,
            int pageSize) {
        Objects.requireNonNull(content, "content must not be null");
        this.content = List.copyOf(content);
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    /** Unmodifiable list of items on this page. */
    public List<T> getContent() {
        return content;
    }

    /** Total number of elements across all pages. */
    public long getTotalElements() {
        return totalElements;
    }

    /** Total number of pages available. */
    public int getTotalPages() {
        return totalPages;
    }

    /** Current page index (0-based). */
    public int getPageNumber() {
        return pageNumber;
    }

    /** Maximum number of items per page. */
    public int getPageSize() {
        return pageSize;
    }

    /** {@code true} if this is the last page. */
    public boolean isLast() {
        return pageNumber + 1 >= totalPages;
    }

    /** {@code true} if content is empty. */
    public boolean isEmpty() {
        return content.isEmpty();
    }
}

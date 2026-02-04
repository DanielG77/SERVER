package com.tournaments.presentation.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PaginationMeta {
    @JsonProperty("pagination")
    private PaginationInfo pagination;

    public PaginationMeta(long total, int page, int limit) {
        this.pagination = new PaginationInfo(total, page, limit);
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public static class PaginationInfo {
        @JsonProperty("total")
        private long total;

        @JsonProperty("page")
        private int page;

        @JsonProperty("limit")
        private int limit;

        public PaginationInfo(long total, int page, int limit) {
            this.total = total;
            this.page = page;
            this.limit = limit;
        }

        public long getTotal() {
            return total;
        }

        public int getPage() {
            return page;
        }

        public int getLimit() {
            return limit;
        }
    }
}

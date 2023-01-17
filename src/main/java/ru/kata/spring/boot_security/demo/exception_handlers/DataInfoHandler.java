package ru.kata.spring.boot_security.demo.exception_handlers;

public class DataInfoHandler {
    private String info;

    public DataInfoHandler() {
    }

    public DataInfoHandler(String info) {
        this.info = info;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public DataInfoHandler getInstanceWithInfo(String info) {
        return new DataInfoHandler(info);
    }
}

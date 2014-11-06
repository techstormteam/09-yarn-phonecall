package com.techstorm.yarn;

import android.annotation.SuppressLint;
import java.text.SimpleDateFormat;
import java.util.Date;


public class CallLog {
	private String number;
	private String name;
	private int type;
	private int duration;
	private String date;
	private String time;
	
	public String getNumber() {
		return number;
	}
	public String getName() {
		if (name == null) {
			return "";
		}
		return name;
	}
	public int getType() {
		return type;
	}
	public int getDuration() {
		return duration;
	}
	public String getDate() {
		return date;
	}
	public String getTime() {
		return time;
	}
	
	public void setNumber(String number) {
		this.number = number;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setType(int type) {
		this.type = type;
	}
	public void setDuration(String duration) {
		if (StringUtil.isNullOrEmpty(duration)) {
			this.duration = IntegerUtil.parseInt(duration);
		}
	}
	@SuppressLint("SimpleDateFormat") public void setDate(Date dateTime) {
		this.date = new SimpleDateFormat("yyyy-MM-dd").format(dateTime);
		this.time = new SimpleDateFormat("HH:mm").format(dateTime);
	}
	
	
}

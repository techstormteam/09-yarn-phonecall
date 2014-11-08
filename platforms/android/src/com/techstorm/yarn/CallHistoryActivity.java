package com.techstorm.yarn;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringEscapeUtils;
import org.linphone.FragmentsAvailable;
import org.linphone.LinphoneActivity;
import org.linphone.core.LinphoneAddress;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.SparseArray;
import android.view.ContextMenu;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ExpandableListView.OnChildClickListener;
import android.widget.ExpandableListView.OnGroupClickListener;
import android.widget.ImageView;
import android.widget.TextView;

public class CallHistoryActivity extends Activity implements OnClickListener, OnChildClickListener, OnGroupClickListener {

	private Handler mHandler = new Handler();
	private ExpandableListView historyList;
	private TextView balanceText;
	private ImageView balanceImage;
	private LayoutInflater mInflater;
	private SparseArray<List<CallLog>> mLogs; 
	private OnClickListener balanceCLick;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		setContentView(R.layout.call_log_selector);
		mInflater = getLayoutInflater();
		
		balanceCLick = new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				Intent data = new Intent();
				data.putExtra("goToPaymentLink", true);
				setResult(Activity.RESULT_OK, data);
				finish();
			}
		};
		
		String balance = getIntent().getStringExtra("balance");
		balanceText = (TextView) findViewById(R.id.balanceText);
		balanceText.setText(StringEscapeUtils.unescapeHtml4(balance));
		balanceText.setOnClickListener(balanceCLick);
		
		balanceImage = (ImageView) findViewById(R.id.balanceImage);
		balanceImage.setOnClickListener(balanceCLick);
		
        historyList = (ExpandableListView) findViewById(R.id.historyList);
        historyList.setOnChildClickListener(this);
        historyList.setOnGroupClickListener(this);
        
    }
	
	
	@Override
	public void onResume() {
		super.onResume();
		
		if (LinphoneActivity.isInstanciated()) {
			LinphoneActivity.instance().selectMenu(FragmentsAvailable.HISTORY);
			
			if (getResources().getBoolean(R.bool.show_statusbar_only_on_dialer)) {
				LinphoneActivity.instance().hideStatusBar();
			}
		}
		
		initLogsLists(getCallLogs());
		historyList.setAdapter(new CallHistoryAdapter(this.getApplicationContext()));
        expandAllGroups();
	}
	
	private List<CallLog> getCallLogs() {
		List<CallLog> logs = new ArrayList<CallLog>();
		Uri allCalls = Uri.parse("content://call_log/calls");
		Cursor cursor = getContentResolver().query(allCalls, null, null, null, null);
		cursor.moveToFirst();
		while (cursor.moveToNext()) {
			CallLog log = new CallLog();
			log.setNumber(cursor.getString(cursor.getColumnIndex(android.provider.CallLog.Calls.NUMBER)));
			log.setName(cursor.getString(cursor.getColumnIndex(android.provider.CallLog.Calls.CACHED_NAME)));
			log.setDuration(cursor.getString(cursor.getColumnIndex(android.provider.CallLog.Calls.DURATION)));
			log.setType(Integer.parseInt(cursor.getString(cursor.getColumnIndex(android.provider.CallLog.Calls.TYPE))));
			long callDate = cursor.getLong(cursor.getColumnIndex(android.provider.CallLog.Calls.DATE));
			log.setDate(new Date(callDate));
			logs.add(log);
		}
		return logs;
	}
	
	private void initLogsLists(List<CallLog> logs) {
		mLogs = new SparseArray<List<CallLog>>(); 
		String[] keys = new String[logs.size()];
		for (CallLog log : logs) {
			String groupBy = getCorrespondentDisplayName(log);
			int key = -1;
			for (int k = 0; k < keys.length; k++) {
				if (keys[k] == null || keys[k].equals(groupBy)) {
					key = k;
					keys[k] = groupBy;
					break;
				}
			}
			
			List<CallLog> group = mLogs.get(key, new ArrayList<CallLog>());
			group.add(log);
			if (group.size() == 1) {
				mLogs.append(key, group);
			}
		}
	}
	
	private void expandAllGroups() {
		mHandler.post(new Runnable() {
			@Override
			public void run() {
				for (int groupToExpand = 0; groupToExpand < historyList.getExpandableListAdapter().getGroupCount(); groupToExpand++) {
					if (!historyList.isGroupExpanded(groupToExpand)) {
						historyList.expandGroup(groupToExpand);
					}
				}
			}
		});
	}
	
	private String getCorrespondentDisplayName(CallLog log) {
		String displayName = log.getDate();
		return displayName;
	}

	@Override
	public void onCreateContextMenu(ContextMenu menu, View v, ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		menu.add(0, v.getId(), 0, getString(R.string.delete));
	}

	@Override
	public void onClick(View v) {

		expandAllGroups();
	}
	
	@Override
	public boolean onGroupClick(ExpandableListView parent, View v, int groupPosition, long id) {
//		if (isEditMode) {
//			for (LinphoneCallLog log : mLogs.get(groupPosition)) {
//				LinphoneManager.getLc().removeCallLog(log);
//			}
//			
//			initLogsLists(getCallLogs());
//			if (!hideHistoryListAndDisplayMessageIfEmpty()) {
//				historyList.setAdapter(new CallHistoryAdapter(this.getApplicationContext()));
//			}
//	        expandAllGroups();
//		}
		return false;
	}

	@Override
	public boolean onChildClick(ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
		CallLog log = mLogs.get(groupPosition).get(childPosition);
		
		Intent data = new Intent();
		data.putExtra("callLogPhoneNumber", log.getNumber());
		setResult(Activity.RESULT_OK, data);
		finish();
		return true;
	}
	
	
	class CallHistoryAdapter extends BaseExpandableListAdapter {
		private Bitmap missedCall, outgoingCall, incomingCall;
		
		CallHistoryAdapter(Context aContext) {
			missedCall = BitmapFactory.decodeResource(getResources(), R.drawable.call_status_missed);
			outgoingCall = BitmapFactory.decodeResource(getResources(), R.drawable.call_status_outgoing);
			incomingCall = BitmapFactory.decodeResource(getResources(), R.drawable.call_status_incoming);
		}
		
		@Override
		public Object getChild(int groupPosition, int childPosition) {
			return mLogs.get(groupPosition).get(childPosition);
		}
		
		@Override
		public long getChildId(int groupPosition, int childPosition) {
			return childPosition;
		}
		
		@Override
		public View getChildView(int groupPosition, int childPosition,
				boolean isLastChild, View convertView, ViewGroup parent) {
			View view = null;
			if (convertView != null) {
				view = convertView;
			} else {
				view = mInflater.inflate(R.layout.history_cell, parent,false);
			}
			
			final CallLog log = (CallLog) getChild(groupPosition, childPosition);
			final LinphoneAddress address;
			
			TextView displayName = (TextView) view.findViewById(R.id.dateAndTime);
			ImageView detail = (ImageView) view.findViewById(R.id.detail);
			ImageView delete = (ImageView) view.findViewById(R.id.delete);
			ImageView callDirection = (ImageView) view.findViewById(R.id.icon);
			
			
//			if (log.getType() == CallDirection.Incoming) {
//				address = log.getFrom();
//				if (log.getStatus() == CallStatus.Missed) {
//					callDirection.setImageBitmap(missedCall);
//				} else {
//					callDirection.setImageBitmap(incomingCall);
//				}
//			} else {
//				address = log.getTo();
//				callDirection.setImageBitmap(outgoingCall);
//			}
			if (android.provider.CallLog.Calls.MISSED_TYPE == log.getType()) {
				callDirection.setImageBitmap(missedCall);
			} else if (android.provider.CallLog.Calls.INCOMING_TYPE == log.getType()) {
				callDirection.setImageBitmap(incomingCall);
			} else if (android.provider.CallLog.Calls.OUTGOING_TYPE == log.getType()) {
				callDirection.setImageBitmap(outgoingCall);
			}
			
			if (!StringUtil.isNullOrEmpty(log.getName())) {
				displayName.setText(log.getName());
			} else {
				displayName.setText(log.getNumber());
			}
//			if (isEditMode) {
//				delete.setVisibility(View.VISIBLE);
//				detail.setVisibility(View.GONE);
//			} else {
//				delete.setVisibility(View.GONE);
//				detail.setVisibility(View.VISIBLE);
//				detail.setOnClickListener(new OnClickListener() {
//					@Override
//					public void onClick(View v) {
//						if (LinphoneActivity.isInstanciated()) {
//							LinphoneActivity.instance().displayHistoryDetail(address.asStringUriOnly(), log);
//						}
//					}
//				});
//			}

			return view;
		}
		
		@Override
		public int getChildrenCount(int groupPosition) {
			return mLogs.get(groupPosition).size();
		}
		
		@Override
		public Object getGroup(int groupPosition) {
			return mLogs.get(groupPosition);
		}
		
		@Override
		public int getGroupCount() {
			return mLogs.size();
		}
		
		@Override
		public long getGroupId(int groupPosition) {
			return groupPosition;
		}
		
		@Override
		public View getGroupView(int groupPosition, boolean isExpanded,
				View convertView, ViewGroup parent) {
			View view = null;
			if (convertView != null) {
				view = convertView;
			} else {
				view = mInflater.inflate(R.layout.history_group, parent,false);
			}
			
			CallLog log = (CallLog) getChild(groupPosition, 0);
			
			TextView contact = (TextView) view.findViewById(R.id.sipUri);
			ImageView delete = (ImageView) view.findViewById(R.id.delete);
			
			
			String displayName = getCorrespondentDisplayName(log);
			contact.setText(displayName + " (" + getChildrenCount(groupPosition) + ")");
			

			return view;
		}
		
		@Override
		public boolean hasStableIds() {
			return false;
		}
		
		@Override
		public boolean isChildSelectable(int groupPosition, int childPosition) {
			return true;
		}
	}
}

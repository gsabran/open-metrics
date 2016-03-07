Meteor.methods({
  updateMetric: (params) => {
    let {metricId, title, desc, type, unit, order, isRequest, script, request} = params;
    const payload = {
      title,
      desc,
      type,
      unit,
      order,
      isRequest,
      script,
      request,
    }
    if (!metricId) {
      payload.order = Metrics.find().count() + 1;
      return  Metrics.insert(payload);
    }
    Metrics.update({_id: metricId}, {$set: payload});
    return Metrics.findOne(metricId)
  },
  getMetric: (metricId) => {
    const metric = Metrics.findOne(metricId);
    if (isRequest) {
      const res = Meteor.wrapAsync(() => {
        Meteor.http.post(
          metric.request.url,
          {data: metric.request.params}
        );
      })();
    } else {
      const res = eval(metric.script);
      return {metric: metric, data: res};
    }
  }
});